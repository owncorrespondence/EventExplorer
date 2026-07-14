import { PixelRatio } from "react-native"

import type { TicketmasterEvent, TicketmasterImage } from "@/services/api/event/types"

export interface EventDetailsView {
  id: string
  name: string
  heroImage?: string // large hero (undefined → screen shows fallback)
  when: { date?: string; time?: string; timeZone?: string }
  venue?: { name?: string; cityCountry?: string; label?: string }
  tags: string[] // classification / genre chips
  price?: string // only when available
  ticketUrl?: string // "Get tickets" target
}
// ---------- venue ----------

function formatWhen(event: TicketmasterEvent) {
  const start = event.dates?.start
  const timeZone = event.dates?.timezone ?? event._embedded?.venues?.[0]?.timezone

  if (start?.dateTime) {
    const d = new Date(start.dateTime) // UTC instant
    return {
      date: new Intl.DateTimeFormat("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone,
      }).format(d),
      time: new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone,
        timeZoneName: "short",
      }).format(d),
      timeZone,
    }
  }
  // fallback: API's already-local strings (no conversion needed)
  return { date: start?.localDate, time: start?.localTime, timeZone }
}

function getVenue(event: TicketmasterEvent) {
  const v = event._embedded?.venues?.[0]
  if (!v) return undefined
  const cityCountry = [v.city?.name, v.country?.name].filter(Boolean).join(", ")
  return {
    name: v.name,
    cityCountry: cityCountry || undefined,
    label: [v.name, cityCountry].filter(Boolean).join(" · "), // "MSG · New York, USA"
  }
}

function getTags(event: TicketmasterEvent): string[] {
  const c = event.classifications?.[0]
  if (!c) return []
  return [c.segment?.name, c.genre?.name, c.subGenre?.name]
    .filter((n): n is string => Boolean(n) && n !== "Undefined")
    .filter((n, i, arr) => arr.indexOf(n) === i)
}

function getPrice(event: TicketmasterEvent): string | undefined {
  const p = event.priceRanges?.[0]
  if (!p || p.min == null) return undefined
  const fmt = (v: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: p.currency ?? "USD",
      maximumFractionDigits: 0,
    }).format(v)
  return p.max != null && p.max !== p.min ? `${fmt(p.min)} – ${fmt(p.max)}` : fmt(p.min)
}

export function toEventDetailsView(event: TicketmasterEvent, width: number): EventDetailsView {
  return {
    id: event.id,
    name: event.name,
    heroImage: pickImage(event.images, { displayWidth: width, ratio: "16_9" }),
    when: formatWhen(event),
    venue: getVenue(event),
    tags: getTags(event),
    price: getPrice(event),
    ticketUrl: event.url,
  }
}

type Ratio = "16_9" | "3_2" | "4_3"

interface PickOpts {
  /** logical display width in px (device scale applied automatically) */
  displayWidth: number
  /** preferred aspect ratio; falls back to any if none match */
  ratio?: Ratio
}

export function pickImage(
  images: TicketmasterImage[] | undefined,
  { displayWidth, ratio }: PickOpts,
): string | undefined {
  const usable = images?.filter((i) => i.url && !i.fallback)
  if (!usable?.length) return undefined

  const target = displayWidth * PixelRatio.get() // real pixels the device needs
  const pool = ratio ? usable.filter((i) => i.ratio === ratio) : usable
  const list = pool.length ? pool : usable

  // smallest image that meets the target (sharp, not oversized)
  const bigEnough = list
    .filter((i) => (i.width ?? 0) >= target)
    .sort((a, b) => (a.width ?? 0) - (b.width ?? 0))
  if (bigEnough.length) return bigEnough[0].url

  // nothing big enough → use the largest available
  return [...list].sort((a, b) => (b.width ?? 0) - (a.width ?? 0))[0]?.url
}
