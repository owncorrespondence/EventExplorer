export interface PageInfo {
  size: number
  totalElements: number
  totalPages: number
  number: number
}

export interface EventsSearchResponse {
  _embedded?: {
    events: TicketmasterEvent[]
  }
  _links: {
    first?: TicketmasterLink
    self: TicketmasterLink
    next?: TicketmasterLink
    prev?: TicketmasterLink
    last?: TicketmasterLink
  }
  page: PageInfo
}

export interface TicketmasterLink {
  href: string
  templated?: boolean
}

export interface EventLinks {
  self: TicketmasterLink
  venues?: TicketmasterLink[]
  attractions?: TicketmasterLink[]
}

export type ImageRatio = "16_9" | "3_2" | "4_3"

export interface TicketmasterImage {
  url: string
  ratio?: ImageRatio
  width?: number
  height?: number
  /** true if this is a fallback image, not the event's own */
  fallback?: boolean
  attribution?: string
}

/** Local time strings are "HH:mm:ss"; dateTime is ISO-8601 UTC */
export interface EventStartDate {
  localDate?: string
  localTime?: string
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

export type EventStatusCode = "onsale" | "offsale" | "canceled" | "postponed" | "rescheduled"

export interface EventStatus {
  code?: EventStatusCode
}

export interface EventDates {
  start?: EventStartDate
  end?: EventEndDate
  access?: EventAccessDate
  timezone?: string
  status?: EventStatus
  spanMultipleDays?: boolean
}

export interface SalesDate {
  startDateTime?: string
  startTBD?: boolean
  startTBA?: boolean
  endDateTime?: string
}

export interface EventSales {
  public?: SalesDate
  presales?: Array<{
    name?: string
    description?: string
    url?: string
    startDateTime?: string
    endDateTime?: string
  }>
}

export interface PriceRange {
  type?: string
  currency?: string
  min?: number
  max?: number
}

export interface Promoter {
  id?: string
  name?: string
  description?: string
}

/** A single classification (genre/segment) for an event */
export interface Classification {
  primary?: boolean
  segment?: ClassificationRef
  genre?: ClassificationRef
  subGenre?: ClassificationRef
  type?: ClassificationRef
  subType?: ClassificationRef
  family?: boolean
}

export interface ClassificationRef {
  id?: string
  name?: string
}

export interface Seatmap {
  staticUrl?: string
  id?: string
}

export interface Accessibility {
  info?: string
  ticketLimit?: number
  id?: string
}

export interface TicketLimit {
  info?: string
  id?: string
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

export interface GeoLocation {
  longitude?: number
  latitude?: number
}

export interface Alias {
  [key: string]: string
}

/** Embedded related entities. Kept loose — model Venue/Attraction if you consume them */
export interface EventEmbedded {
  venues?: unknown[]
  attractions?: unknown[]
}

export interface TicketmasterEvent {
  _links: EventLinks
  _embedded?: EventEmbedded
  type: string
  distance?: number
  units?: string
  location?: GeoLocation
  id: string
  locale?: string
  name: string
  description?: string
  additionalInfo?: string
  url?: string
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
