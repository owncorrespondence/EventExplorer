import Constants from "expo-constants"

/**
 * These are configuration settings for the dev environment.
 *
 * Do not include API secrets in this file or anywhere in your JS.
 *
 * https://reactnative.dev/docs/security#storing-sensitive-info
 */
export default {
  API_URL: "https://api.rss2json.com/v1/",
  TICKETMASTER_API: "https://app.ticketmaster.com",
  API_KEY: Constants.expoConfig?.extra?.ticketmasterApiKey ?? "",
}
