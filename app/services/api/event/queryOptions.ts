import {
  infiniteQueryOptions,
  queryOptions,
  InfiniteData,
  keepPreviousData,
} from "@tanstack/react-query"
import { ApiResponse } from "apisauce"

import Config from "@/config"
import { api } from "@/services/api"
import { EVENT_KEYS } from "@/services/api/event/eventsKeys"
import { EventDetailsResponse, EventsSearchResponse } from "@/services/api/event/types"

export const getEventsQueryOptions = () => {
  return queryOptions<ApiResponse<EventsSearchResponse>>({
    queryKey: EVENT_KEYS.all,
    queryFn: async () => {
      const params = new URLSearchParams({
        apikey: Config.API_KEY,
        size: "20",
      })
      return api.apisauce.get<EventsSearchResponse>(
        `/discovery/v2/events.json?${params.toString()}`,
      )
    },
  })
}

export const getInfinityQueryOptions = (keyword?: string) => {
  return infiniteQueryOptions<
    ApiResponse<EventsSearchResponse>,
    Error,
    InfiniteData<ApiResponse<EventsSearchResponse>>
  >({
    queryKey: EVENT_KEYS.list(keyword || ""),
    placeholderData: keepPreviousData,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const { totalPages, number, totalElements } = lastPage.data?.page || {}
      if (totalElements && typeof number === "number" && typeof totalPages === "number") {
        return totalPages > number + 1 ? number + 1 : undefined
      }
      return undefined
    },

    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams({
        apikey: Config.API_KEY,
        page: String(pageParam),
        size: "20",
        sort: "date,desc",
      })
      if (keyword) {
        params.set("keyword", keyword)
      }
      return api.apisauce.get<EventsSearchResponse>(
        `/discovery/v2/events.json?${params.toString()}`,
      )
    },
  })
}

export const getEventDetails = (eventId: string) => {
  return queryOptions<ApiResponse<EventDetailsResponse>>({
    queryKey: EVENT_KEYS.detail(eventId),
    queryFn: async () => {
      const params = new URLSearchParams({
        apikey: Config.API_KEY,
        size: "20",
      })
      return api.apisauce.get(`/discovery/v2/events/${eventId}/?${params.toString()}`)
    },
  })
}
