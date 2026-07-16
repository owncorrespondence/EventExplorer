import { FC, useCallback } from "react"
import { ActivityIndicator, ScrollView, useWindowDimensions, View } from "react-native"
import { useQuery } from "@tanstack/react-query"

import { Button } from "@/components/Button"
import { EmptyState } from "@/components/EmptyState"
import { $aligner } from "@/components/layout"
import { RemoteImage } from "@/components/RemoteImage"
import { EventDetailsCard } from "@/screens/Events/components/EventDetailsCard"
import { EventDetailsView, toEventDetailsView } from "@/services/api/event/eventMappers"
import { getEventDetails } from "@/services/api/event/queryOptions"
import { useIsFavourite, useToggleFavourite } from "@/state/favourites/selectors"
import { useAppTheme } from "@/theme/context"
import { ApiError } from "@/utils/errors"
import { openLinkInBrowser } from "@/utils/openLinkInBrowser"

interface EventDetailsContainerProps {
  eventId: string
}
export const EventDetails: FC<EventDetailsContainerProps> = ({ eventId }) => {
  const { themed } = useAppTheme()

  const favourite = useIsFavourite(eventId)
  const toggle = useToggleFavourite()
  const { width } = useWindowDimensions()

  const { data, isError, isRefetching, isLoading, refetch, error } = useQuery({
    ...getEventDetails(eventId),
    select: (data) => {
      return data.data ? toEventDetailsView(data.data, width, "16_9") : undefined
    },
    staleTime: Infinity,
    gcTime: 1000 * 60 * 5,
  })

  const handleFavouritePress = useCallback(
    (item: EventDetailsView) => {
      toggle({
        id: item.id,
        name: item.name,
        heroImage: item.heroImage,
        dateInfo: item.dateInfo,
        tags: item.tags,
        savedAt: Date.now(),
      })
    },
    [toggle],
  )

  if (isLoading || (isRefetching && !data)) {
    return (
      <View style={themed($aligner)}>
        <ActivityIndicator />
      </View>
    )
  }

  if (isError) {
    return (
      <EmptyState
        headingTx="emptyStateComponent:generic.heading"
        contentTx={(error as ApiError)?.messageTx || "errors:generic"}
        buttonTx="emptyStateComponent:generic.button"
        buttonOnPress={() => refetch()}
      />
    )
  }

  if (!data) {
    return (
      <EmptyState
        buttonTx="emptyStateComponent:generic.button"
        buttonOnPress={() => refetch()}
        contentTx={"emptyStateComponent:generic.content"}
      />
    )
  }

  return (
    <>
      <ScrollView>
        <RemoteImage uri={data.heroImage} aspectRatio={16 / 9} radius={12} />
        <EventDetailsCard
          data={data}
          handleFavouritePress={handleFavouritePress}
          isFavourite={favourite}
        />
      </ScrollView>
      {data.ticketUrl && (
        <Button text="Get tickets" onPress={() => openLinkInBrowser(data.ticketUrl!)} />
      )}
    </>
  )
}

EventDetails.displayName = "EventDetails"
