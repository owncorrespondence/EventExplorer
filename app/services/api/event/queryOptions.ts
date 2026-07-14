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
      return api.apisauce.get<EventsSearchResponse>(
        `/discovery/v2/events.json?apikey=${Config.API_KEY}`,
      )
    },
  })
}

export const getInfinityQueryOptions = () => {
  return infiniteQueryOptions<
    ApiResponse<EventsSearchResponse>,
    Error,
    InfiniteData<ApiResponse<EventsSearchResponse>>
  >({
    queryKey: EVENT_KEYS.all,
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
      return api.apisauce.get<EventsSearchResponse>(
        `/discovery/v2/events.json?apikey=${Config.API_KEY}&page=${pageParam}&size=20&sort=date,desc`,
      )
    },
  })
}

export const getEventDetails = (eventId: string) => {
  return queryOptions<ApiResponse<EventDetailsResponse>>({
    queryKey: EVENT_KEYS.detail(eventId),
    queryFn: async () => {
      return api.apisauce.get(`/discovery/v2/events/${eventId}?apikey=${Config.API_KEY}`)
    },
  })
}
