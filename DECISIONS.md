Overview
The project was bootstrapped from the Ignite / Expo template described in the documentation. Several foundational choices therefore come "out of the box" from that template, and the rest are deliberate decisions layered on top for this app.

Foundations (from the template)
Because the starter template was used, the following are inherited defaults rather than independent picks:

Expo — managed React Native workflow (dev builds, native modules via prebuild).
React Navigation — native-stack navigation.
MMKV — fast, synchronous local key–value storage.
apisauce — HTTP client wrapper around Axios.
Styling convention — style objects named with a $ prefix (e.g. $container, $header) rather than StyleSheet.create.
apisauce — added a throwable wrapper
apisauce does not throw on HTTP errors; it returns a response object with an ok flag. Left as-is, a 400/429/500 would be treated as a success by the data layer, so error states, retries, and error UIs would never trigger.

To fix this, a small generic wrapper (withThrowable) inspects the response and throws a typed ApiError when ok is false. This centralises HTTP error handling: every request wraps its apisauce call, and downstream retry logic and error UIs work correctly. Error messages are returned as i18n keys (not raw strings) so they are localisable.

Styling — $-prefixed objects vs StyleSheet
The template's $-object convention is used for consistency. This is reasonable for most UI, but note that StyleSheet.create is still preferable where performance matters (it registers styles once and passes IDs across the bridge), as are purpose-built styling frameworks — inline object literals recreated on every render should be avoided in hot paths (e.g. list rows).

API management — TanStack Query
TanStack Query was chosen for server-state management, specifically for its caching and invalidation:

Caching for navigation: opening a single event reuses cached data. With staleTime/gcTime configured, navigating into an event that is already cached results in no additional request — the detail screen renders from cache until the cache is explicitly invalidated.
Invalidation: a hierarchical query-key factory (EVENT_KEYS) allows targeted invalidation — the whole events tree, just the list, just details, or a single event — so pull-to-refresh and mutations refresh exactly the right data.
Infinite list: the events feed uses an infinite query with deterministic sorting and a stable date boundary to keep pagination duplicate-free, plus error handling that distinguishes a fatal first-load failure from a recoverable next-page failure.
Local state & persistence — Zustand + MMKV
Zustand is used for client state, with MMKV persistence.

Favourites are client state (not server state), so they live in a Zustand store rather than TanStack Query.
The store is persisted to MMKV, making favourites fully offline: they are read and written locally with no network dependency, and survive app restarts.
Favourites are stored as lightweight event snapshots (id, name, image, date, venue), so the favourites screen renders completely offline without refetching.
The same selector hook (useIsFavourite) is used by both the list and the detail screen, guaranteeing the favourite toggle state stays consistent across screens.
Summary
Concern	Choice	Rationale
Framework	Expo + React Native (template)	Inherited from starter template
Navigation	React Navigation (native-stack)	Inherited from starter template
HTTP	apisauce + withThrowable	Template default; wrapper added so errors actually throw
Server state/cache	TanStack Query	Caching + targeted invalidation; cached event navigation
Client state	Zustand + MMKV persistence	Offline-first favourites, consistent across screens
Storage	MMKV	Fast, synchronous, offline
Styling	$-prefixed style objects	Template convention (StyleSheet preferred for perf)
