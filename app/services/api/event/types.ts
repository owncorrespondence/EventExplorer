// Ticketmaster Discovery API v2 — types (from official docs)

// ---------------------------------------------------------------------------
// Shared
// ---------------------------------------------------------------------------
export interface TicketmasterLink {
  href: string
  templated?: boolean
}

export interface EventLinks {
  self?: TicketmasterLink
  venues?: TicketmasterLink[]
  attractions?: TicketmasterLink[]
}

export interface TicketmasterImage {
  url?: string
  ratio?: "16_9" | "3_2" | "4_3"
  width?: number
  height?: number
  fallback?: boolean
  attribution?: string
}

// ---------------------------------------------------------------------------
// Classifications
// ---------------------------------------------------------------------------
export interface ClassificationRef {
  id?: string
  name?: string
  locale?: string
  genres?: ClassificationRef[] // segment only
  subGenres?: ClassificationRef[] // segment, genre
  subTypes?: ClassificationRef[] // type only
}

export interface Classification {
  primary?: boolean
  segment?: ClassificationRef
  genre?: ClassificationRef
  subGenre?: ClassificationRef
  type?: ClassificationRef
  subType?: ClassificationRef
  family?: boolean
}

// ---------------------------------------------------------------------------
// Dates
// ---------------------------------------------------------------------------
export interface EventStatus {
  code?: "onsale" | "offsale" | "canceled" | "postponed" | "rescheduled"
}

export interface EventStartDate {
  localDate?: string
  localTime?: string // docs say "object"; real API returns "HH:mm:ss"
  dateTime?: string
  dateTBD?: boolean
  dateTBA?: boolean
  timeTBA?: boolean
  noSpecificTime?: boolean
}

export interface EventEndDate {
  localDate?: string
  localTime?: string
  dateTime?: string
  approximate?: boolean
  noSpecificTime?: boolean
}

export interface EventAccessDate {
  startDateTime?: string
  startApproximate?: boolean
  endDateTime?: string
  endApproximate?: boolean
}

export interface EventDates {
  start?: EventStartDate
  end?: EventEndDate
  access?: EventAccessDate
  timezone?: string
  status?: EventStatus
  spanMultipleDays?: boolean
}

// ---------------------------------------------------------------------------
// Sales / price / promoter
// ---------------------------------------------------------------------------
export interface PublicSale {
  startDateTime?: string
  endDateTime?: string
  startTBD?: boolean
}

export interface Presale {
  name?: string
  description?: string
  url?: string
  startDateTime?: string
  endDateTime?: string
}

export interface EventSales {
  public?: PublicSale
  presales?: Presale[]
}

export interface PriceRange {
  type?: string // enum: "standard"
  currency?: string
  min?: number
  max?: number
}

export interface Promoter {
  id?: string
  name?: string
  description?: string
}

// ---------------------------------------------------------------------------
// Misc event sub-objects
// ---------------------------------------------------------------------------
export interface Seatmap {
  staticUrl?: string
}

export interface Accessibility {
  info?: string
}

export interface TicketLimit {
  info?: string
  infos?: Record<string, string>
}

export interface GeoLocation {
  longitude?: string // real API returns strings, not numbers
  latitude?: string
}

export interface Place {
  area?: { name?: string }
  address?: { line1?: string; line2?: string; line3?: string }
  city?: { name?: string }
  state?: { name?: string; stateCode?: string }
  country?: { name?: string; countryCode?: string }
  postalCode?: string
  location?: GeoLocation
  name?: string
}

// ---------------------------------------------------------------------------
// Venue (from official docs)
// ---------------------------------------------------------------------------
export interface Venue {
  type?: string
  distance?: number
  units?: string
  id?: string
  locale?: string
  name?: string
  description?: string
  additionalInfo?: string
  url?: string
  postalCode?: string
  timezone?: string
  currency?: string
  address?: { line1?: string; line2?: string; line3?: string }
  city?: { name?: string }
  state?: { name?: string; stateCode?: string }
  country?: { name?: string; countryCode?: string }
  location?: GeoLocation
  markets?: Array<{ id?: string; name?: string }>
  dmas?: Array<{ id?: number }>
  images?: TicketmasterImage[]
  social?: { twitter?: { handle?: string } }
  boxOfficeInfo?: {
    phoneNumberDetail?: string
    openHoursDetail?: string
    acceptedPaymentDetail?: string
    willCallDetail?: string
  }
  parkingDetail?: string
  accessibleSeatingDetail?: string
  generalInfo?: { generalRule?: string; childRule?: string }
  ada?: { adaPhones?: string; adaCustomCopy?: string; adaHours?: string }
  upcomingEvents?: Record<string, number>
  externalLinks?: Record<string, Array<{ url: string }>>
  test?: boolean
  aliases?: string[]
  localizedAliases?: Record<string, string[]>
  _links?: EventLinks
}

// ---------------------------------------------------------------------------
// Attraction
// ---------------------------------------------------------------------------
export interface Attraction {
  type?: string
  id?: string
  locale?: string
  name?: string
  description?: string
  additionalInfo?: string
  url?: string
  images?: TicketmasterImage[]
  classifications?: Classification[]
  upcomingEvents?: Record<string, number>
  externalLinks?: Record<string, Array<{ url: string }>>
  aliases?: string[]
  test?: boolean
  _links?: EventLinks
}

// ---------------------------------------------------------------------------
// Event
// ---------------------------------------------------------------------------
export interface EventEmbedded {
  venues?: Venue[]
  attractions?: Attraction[]
}

export interface TicketmasterEvent {
  _links: EventLinks
  _embedded?: EventEmbedded
  type: string
  id: string
  locale?: string
  name: string
  description?: string
  additionalInfo?: string
  url?: string
  distance?: number
  units?: string
  location?: GeoLocation
  images?: TicketmasterImage[]
  dates?: EventDates
  sales?: EventSales
  info?: string
  pleaseNote?: string
  priceRanges?: PriceRange[]
  promoter?: Promoter
  promoters?: Promoter[]
  outlets?: unknown[]
  productType?: string
  products?: unknown[]
  seatmap?: Seatmap
  accessibility?: Accessibility
  ticketLimit?: TicketLimit
  classifications?: Classification[]
  place?: Place
  externalLinks?: Record<string, Array<{ url: string }>>
  test?: boolean
  aliases?: string[]
  localizedAliases?: Record<string, string[]>
}

// ---------------------------------------------------------------------------
// Search response wrapper (GET /events.json)
// ---------------------------------------------------------------------------
export interface PageInfo {
  size: number
  totalElements: number
  totalPages: number
  number: number
}

export interface EventsSearchResponse {
  _embedded?: { events: TicketmasterEvent[] }
  _links: {
    first?: TicketmasterLink
    self: TicketmasterLink
    next?: TicketmasterLink
    prev?: TicketmasterLink
    last?: TicketmasterLink
  }
  page: PageInfo
}

export interface EventDetailsResponse extends TicketmasterEvent {}
