/** Application-level constants (not tenant/business branding). */
export const APP_NAME = "Maison Rose";

export const SUPPORTED_LOCALES = ["en", "hu"] as const;
export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: AppLocale = "en";
