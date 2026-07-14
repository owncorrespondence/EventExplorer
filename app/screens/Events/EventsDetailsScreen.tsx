import { useCallback, useState } from "react"
import { ActivityIndicator, ScrollView, View, ViewStyle } from "react-native"
import { useWindowDimensions } from "react-native"
import { useRoute } from "@react-navigation/native"
import { useQuery } from "@tanstack/react-query"

import { Button } from "@/components/Button"
import { EmptyState } from "@/components/EmptyState"
import { $content, $title } from "@/components/layout"
import { RemoteImage } from "@/components/RemoteImage"
import { Tag } from "@/components/Tag"
import { Text } from "@/components/Text"
import { FavouriteButton } from "@/components/Toggle/FavouriteButton"
import { EventsStackScreenProps, Routes } from "@/navigators/navigationTypes"
import { toEventDetailsView } from "@/services/api/event/eventMappers"
import { getEventDetails } from "@/services/api/event/queryOptions"
import { useAppTheme } from "@/theme/context"
import { $styles } from "@/theme/styles"
import { ThemedStyle } from "@/theme/types"
import { openLinkInBrowser } from "@/utils/openLinkInBrowser"
import { useSafeAreaInsetsStyle } from "@/utils/useSafeAreaInsetsStyle"

export const EventsDetailsScreen = () => {
  const { params } = useRoute<EventsStackScreenProps<Routes["EVENT_DETAILS"]>["route"]>()
  const { themed } = useAppTheme()
  const $containerInsets = useSafeAreaInsetsStyle(["bottom"])
  const [favourite, setFavourite] = useState<boolean>(false)
  const { width } = useWindowDimensions()

  const { data, isError, isFetching, isLoading, refetch } = useQuery({
    ...getEventDetails(params.eventId),
    select: (data) => {
      return data.data ? toEventDetailsView(data.data, width) : undefined
    },
    staleTime: Infinity,
    gcTime: 1000 * 60 * 5,
  })

  const handleFavouritePress = useCallback(() => {
    return setFavourite((prevState) => !prevState)
  }, [])

  if (isLoading || (isFetching && !data)) {
    return <ActivityIndicator />
  }

  if (isError) {
    return null
  }

  if (!data) {
    return <EmptyState buttonOnPress={() => refetch()} />
  }

  return (
    <View style={[themed($container), $containerInsets]}>
      <ScrollView>
        <RemoteImage uri={data.heroImage} aspectRatio={16 / 9} radius={12} />
        <View style={themed($contentList)}>
          <View style={[$styles.row, themed($favouriteContainer)]}>
            <View style={[$styles.row, themed($favouritesBlock)]}>
              <Text
                style={themed($content)}
                tx={favourite ? "eventDetailsScreen:saved" : "eventDetailsScreen:save"}
              />
              <FavouriteButton liked={favourite} onToggle={handleFavouritePress} />
            </View>
          </View>
          <Text style={themed($title)} numberOfLines={3}>
            {data.name}
          </Text>

          <Text style={themed($content)}>{data.when.date}</Text>
          <Text style={themed($content)}>{data.when.time}</Text>
          <Text style={themed($content)}>{data.venue?.name}</Text>
          <Text style={themed($content)}>{data.venue?.cityCountry}</Text>
          <View style={themed($tagList)}>
            {data.tags.map((el) => {
              return <Tag key={el} label={el} />
            })}
          </View>

          {data?.price ? <Text>{data.price}</Text> : null}
        </View>
      </ScrollView>
      {data.ticketUrl && (
        <Button text="Get tickets" onPress={() => openLinkInBrowser(data.ticketUrl!)} />
      )}
    </View>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  paddingHorizontal: spacing.md,
})

const $favouriteContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  justifyContent: "flex-end",
})

const $favouritesBlock: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.md,
})

const $tagList: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.xs,
  flexDirection: "row",
})

const $contentList: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.sm,
  padding: spacing.md,
})
