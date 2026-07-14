import { FC, useCallback } from "react"
import { ActivityIndicator, FlatList, ListRenderItemInfo, View, ViewStyle } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query"

import { Button } from "@/components/Button"
import { EmptyState } from "@/components/EmptyState"
import { $container, $contentContainerList, $globalLoadingContainer } from "@/components/layout"
import { Screen } from "@/components/Screen"
import { TextField } from "@/components/TextField"
import { EventsStackScreenProps, ROUTES, Routes } from "@/navigators/navigationTypes"
import { SearchEventCard } from "@/screens/Events/components/SearchEventCard"
import { EventDetailsView, toEventDetailsView } from "@/services/api/event/eventMappers"
import { EVENT_KEYS } from "@/services/api/event/eventsKeys"
import { getInfinityQueryOptions } from "@/services/api/event/queryOptions"
import { TicketmasterEvent } from "@/services/api/event/types"
import { useFavourites } from "@/state/favourites/selectors"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"

export const EventsScreen = () => {
  const { themed } = useAppTheme()
  const queryclient = useQueryClient()
  const navigation = useNavigation<EventsStackScreenProps<Routes["EVENTS"]>["navigation"]>()
  const favourites = useFavourites() // reads MMKV — no fetch, works offline
  const {
    data,
    isError,
    isLoading,
    isRefetching,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    ...getInfinityQueryOptions(),
    select: (data) => {
      const arr = data.pages.flatMap((page) => page.data?._embedded?.events || [])

      return arr.map((el) => toEventDetailsView(el, 88, "4_3"))
      // return data.pages.flatMap((page) => page.data?._embedded?.events || [])
    },
  })

  const onRefresh = useCallback(async () => {
    const { queryKey } = getInfinityQueryOptions()

    queryclient.setQueryData(queryKey, (old) =>
      old ? { pages: old.pages.slice(0, 1), pageParams: old.pageParams.slice(0, 1) } : old,
    )

    await Promise.all([
      refetch(),
      queryclient.invalidateQueries({ queryKey: EVENT_KEYS.details() }),
    ])
  }, [queryclient, refetch])

  const goToEvent = useCallback(
    (eventId: string) => {
      navigation.navigate(ROUTES.EVENTS_NAVIGATOR, {
        screen: ROUTES.EVENT_DETAILS,
        params: {
          eventId: eventId,
        },
      })
    },
    [navigation],
  )

  const goToFavourites = useCallback(() => {
    navigation.navigate(ROUTES.EVENTS_NAVIGATOR, {
      screen: ROUTES.FAVOURITE_EVENTS,
    })
  }, [navigation])

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<EventDetailsView>) => (
      <SearchEventCard item={item} onItemPress={goToEvent} />
    ),
    [goToEvent],
  )
  const extractKey = useCallback((item: EventDetailsView) => item.id, [])

  if (isLoading) {
    return (
      <Screen preset={"fixed"} style={themed($globalLoadingContainer)}>
        <ActivityIndicator />
      </Screen>
    )
  }

  if (isError) {
    return null
  }
  return (
    <Screen preset={"fixed"} style={themed($container)}>
      <FlatList
        ListHeaderComponent={
          <ListHeader hasFavourites={Boolean(favourites.length)} goToFavourites={goToFavourites} />
        }
        stickyHeaderIndices={[0]}
        contentContainerStyle={themed($contentContainerList)}
        data={data || []}
        refreshing={isRefetching}
        onRefresh={onRefresh}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
          }
        }}
        ListFooterComponent={
          isFetchingNextPage ? <ActivityIndicator style={themed($activityIndicator)} /> : null
        }
        keyExtractor={extractKey}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator />
          ) : (
            <EmptyState
              buttonTx={"emptyStateComponent:generic.button"}
              buttonOnPress={() => refetch()}
              content={undefined}
            />
          )
        }

        renderItem={renderItem}
      />
    </Screen>
  )
}

const $activityIndicator: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.md,
})

interface ListHeaderProps {
  goToFavourites?: () => void
  hasFavourites?: boolean
}

const ListHeader: FC<ListHeaderProps> = ({ hasFavourites, goToFavourites }) => {
  const {
    theme: { colors },
  } = useAppTheme()
  return (
    <View style={{ backgroundColor: colors.background }}>
      {hasFavourites ? <Button onPress={goToFavourites} tx={"eventsScreen:favourites"} /> : null}
      <TextField labelTx={"eventsScreen:search"} placeholderTx={"eventsScreen:placeholder"} />
    </View>
  )
}

const $header: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.background, // ⬅️ opaque → rows can't show through
  paddingBottom: spacing.sm, // gap between header and first row
})
