import "server-only";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { decryptToken } from "./crypto";
import type { InstagramFeedResponse, InstagramMediaItem, InstagramConnectionStatus } from "./types";

// Curated high-res editorial Maison Rose Studio fallback items
const FALLBACK_ATELIER_POSTS: InstagramMediaItem[] = [
  {
    id: "atelier-post-1",
    caption: "Glazed rose & pearl chrome dust. Meticulous Russian e-file prep at Maison Rose, Budapest. #maisonrose #russianmanicure #editorialnails",
    media_type: "IMAGE",
    media_url: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=1200&auto=format&fit=crop",
    permalink: "https://www.instagram.com/maisonrose.budapest",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    username: "maisonrose.budapest",
    is_pinned: true,
  },
  {
    id: "atelier-post-2",
    caption: "Architectural micro French tips on BIAB natural strengthening base. #biab #naturalnails #budapestnails",
    media_type: "IMAGE",
    media_url: "https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=900&auto=format&fit=crop",
    permalink: "https://www.instagram.com/maisonrose.budapest",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    username: "maisonrose.budapest",
  },
  {
    id: "atelier-post-3",
    caption: "Cashmere rose nude overlay with high gloss finish. Clean aesthetics on Andrássy út.",
    media_type: "IMAGE",
    media_url: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?q=80&w=900&auto=format&fit=crop",
    permalink: "https://www.instagram.com/maisonrose.budapest",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    username: "maisonrose.budapest",
  },
  {
    id: "atelier-post-4",
    caption: "Soft Gel-X almond extensions in sheer petal blush. Flawless symmetry.",
    media_type: "IMAGE",
    media_url: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?q=80&w=900&auto=format&fit=crop",
    permalink: "https://www.instagram.com/maisonrose.budapest",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    username: "maisonrose.budapest",
  },
  {
    id: "atelier-post-5",
    caption: "Studio sanctuary details and hand-painted 24k gold leaf accents. #maisonrosebudapest",
    media_type: "IMAGE",
    media_url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=900&auto=format&fit=crop",
    permalink: "https://www.instagram.com/maisonrose.budapest",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    username: "maisonrose.budapest",
  },
  {
    id: "atelier-post-6",
    caption: "Warm rosewater soak & botanical oil massage at our beauty sanctuary. A moment for you.",
    media_type: "IMAGE",
    media_url: "https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?q=80&w=900&auto=format&fit=crop",
    permalink: "https://www.instagram.com/maisonrose.budapest",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
    username: "maisonrose.budapest",
  },
];

// In-Memory cache store
let cachedResponse: InstagramFeedResponse | null = null;
let cacheExpiryTime = 0;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour server cache

interface DatabaseConnectionRecord {
  accessToken: string;
  username: string;
  instagramUserId: string;
  connectedAt: string;
  expiresAt?: string;
  isExpired: boolean;
}

function parseRecord(record: {
  encrypted_access_token: string;
  username?: string | null;
  instagram_user_id?: string | null;
  connected_at?: string | null;
  token_expires_at?: string | null;
}): DatabaseConnectionRecord | null {
  try {
    const rawToken = decryptToken(record.encrypted_access_token);
    const expiresAt = record.token_expires_at ? new Date(record.token_expires_at) : null;
    const isExpired = Boolean(expiresAt && expiresAt.getTime() < Date.now());

    return {
      accessToken: rawToken,
      username: record.username || "maisonrose.budapest",
      instagramUserId: record.instagram_user_id || "",
      connectedAt: record.connected_at || new Date().toISOString(),
      expiresAt: record.token_expires_at || undefined,
      isExpired,
    };
  } catch (err: unknown) {
    console.warn("[Instagram Token Decryption Error]:", err instanceof Error ? err.message : String(err));
    return null;
  }
}

/**
 * Resolve Instagram connection record from database via Supabase.
 */
export async function getDatabaseInstagramConnection(businessId?: string): Promise<DatabaseConnectionRecord | null> {
  try {
    const supabase = await createClient();
    let query = supabase.from("instagram_connections").select("*");

    if (businessId) {
      query = query.eq("business_id", businessId);
    }

    const { data: record, error } = await query.order("updated_at", { ascending: false }).limit(1).maybeSingle();

    if (!error && record && record.encrypted_access_token) {
      return parseRecord(record);
    }

    // Fallback to service role admin client if called from unauthenticated public page or background worker
    const adminClient = createAdminClient();
    if (!adminClient) return null;

    let adminQuery = adminClient.from("instagram_connections").select("*");
    if (businessId) {
      adminQuery = adminQuery.eq("business_id", businessId);
    }

    const { data: adminRecord, error: adminErr } = await adminQuery.order("updated_at", { ascending: false }).limit(1).maybeSingle();

    if (!adminErr && adminRecord && adminRecord.encrypted_access_token) {
      return parseRecord(adminRecord);
    }

    return null;
  } catch (err: unknown) {
    console.warn("[Instagram Connection DB Lookup Warning]:", err instanceof Error ? err.message : String(err));
    return null;
  }
}

/**
 * Main function to fetch Instagram Feed (cached 1hr).
 */
export async function fetchInstagramFeed(forceRefresh = false, businessId?: string): Promise<InstagramFeedResponse> {
  const now = Date.now();

  if (!forceRefresh && cachedResponse && now < cacheExpiryTime) {
    return cachedResponse;
  }

  // 1. Try to load database connection record first
  const dbConnection = await getDatabaseInstagramConnection(businessId);

  // If connection exists but token is expired
  if (dbConnection && dbConnection.isExpired) {
    const expiredRes: InstagramFeedResponse = {
      data: FALLBACK_ATELIER_POSTS,
      isFallback: true,
      connectionStatus: "EXPIRED",
      connectedAccount: {
        username: dbConnection.username,
        instagramUserId: dbConnection.instagramUserId,
        connectedAt: dbConnection.connectedAt,
        expiresAt: dbConnection.expiresAt,
      },
      lastSynced: new Date().toISOString(),
      error: "Instagram OAuth access token has expired. Re-authorization required.",
    };
    cachedResponse = expiredRes;
    cacheExpiryTime = now + CACHE_TTL_MS;
    return expiredRes;
  }

  // Determine active token (database connection token preferred, environment token fallback if set)
  const token = dbConnection?.accessToken || process.env.INSTAGRAM_ACCESS_TOKEN;

  if (!token) {
    const notConnectedRes: InstagramFeedResponse = {
      data: FALLBACK_ATELIER_POSTS,
      isFallback: true,
      connectionStatus: "NOT_CONNECTED",
      lastSynced: new Date().toISOString(),
    };
    cachedResponse = notConnectedRes;
    cacheExpiryTime = now + CACHE_TTL_MS;
    return notConnectedRes;
  }

  try {
    // Official Instagram Platform API / v22.0 media endpoint
    const endpoint = `https://graph.instagram.com/v22.0/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username&limit=12&access_token=${encodeURIComponent(token)}`;

    const res = await fetch(endpoint, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      console.warn("[Instagram API Warning]:", res.status, errJson);

      throw new Error(errJson?.error?.message || `Instagram API HTTP ${res.status}`);
    }

    const json = await res.json();
    const rawItems: Record<string, unknown>[] = Array.isArray(json?.data) ? json.data : [];

    if (rawItems.length === 0) {
      throw new Error("Instagram API returned empty media list.");
    }

    const formattedData: InstagramMediaItem[] = rawItems.map((item) => {
      const captionStr = typeof item.caption === "string" ? item.caption : "";
      const mediaType = typeof item.media_type === "string" ? (item.media_type as "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM") : "IMAGE";
      const mediaUrl = typeof item.media_url === "string" ? item.media_url : "";
      const thumbnailUrl = typeof item.thumbnail_url === "string" ? item.thumbnail_url : undefined;
      const permalink = typeof item.permalink === "string" ? item.permalink : "https://www.instagram.com/maisonrose.budapest";
      const timestamp = typeof item.timestamp === "string" ? item.timestamp : new Date().toISOString();
      const username = typeof item.username === "string" ? item.username : dbConnection?.username || "maisonrose.budapest";

      const isVideo = mediaType === "VIDEO";
      const isReel = isVideo && (captionStr.toLowerCase().includes("reel") || captionStr.toLowerCase().includes("#reel"));

      return {
        id: String(item.id ?? Math.random()),
        caption: captionStr || "Maison Rose Studio",
        media_type: mediaType,
        media_url: isVideo ? thumbnailUrl || mediaUrl : mediaUrl,
        thumbnail_url: thumbnailUrl,
        permalink,
        timestamp,
        username,
        is_reel: isReel,
      };
    });

    const successRes: InstagramFeedResponse = {
      data: formattedData,
      isFallback: false,
      connectionStatus: "CONNECTED",
      connectedAccount: dbConnection
        ? {
            username: dbConnection.username,
            instagramUserId: dbConnection.instagramUserId,
            connectedAt: dbConnection.connectedAt,
            expiresAt: dbConnection.expiresAt,
          }
        : {
            username: formattedData[0]?.username || "maisonrose.budapest",
            instagramUserId: "env_configured",
            connectedAt: new Date().toISOString(),
          },
      lastSynced: new Date().toISOString(),
    };

    cachedResponse = successRes;
    cacheExpiryTime = now + CACHE_TTL_MS;
    return successRes;

  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Instagram API unavailable.";
    console.error("[Instagram Feed Fetch Error]:", errorMsg);

    const isExpired = errorMsg.toLowerCase().includes("expired") || errorMsg.toLowerCase().includes("invalid OAuth");
    const connectionStatus: InstagramConnectionStatus = isExpired ? "EXPIRED" : dbConnection ? "ERROR" : "NOT_CONNECTED";

    const fallbackRes: InstagramFeedResponse = {
      data: FALLBACK_ATELIER_POSTS,
      isFallback: true,
      connectionStatus,
      connectedAccount: dbConnection
        ? {
            username: dbConnection.username,
            instagramUserId: dbConnection.instagramUserId,
            connectedAt: dbConnection.connectedAt,
            expiresAt: dbConnection.expiresAt,
          }
        : undefined,
      lastSynced: new Date().toISOString(),
      error: errorMsg,
    };

    cachedResponse = fallbackRes;
    cacheExpiryTime = now + CACHE_TTL_MS;
    return fallbackRes;
  }
}
