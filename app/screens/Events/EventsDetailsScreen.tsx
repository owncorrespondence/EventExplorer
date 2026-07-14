import { useRoute } from "@react-navigation/native"
import { useQuery } from "@tanstack/react-query"

import { EventsStackScreenProps, Routes } from "@/navigators/navigationTypes"
import { getEventDetails } from "@/services/api/event/queryOptions"

export const EventsDetailsScreen = () => {
  const { params } = useRoute<EventsStackScreenProps<Routes["EVENT_DETAILS"]>["route"]>()

  const { data, isError, isLoading } = useQuery({
    ...getEventDetails(params.eventId),
    select: (data) => {
      return data.data
    },
    staleTime: Infinity,
    gcTime: 1000 * 60 * 5,
  })

  return null
}
