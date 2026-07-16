import { FC, useCallback, useState } from "react"
import {
  ActivityIndicator,
  FlatList,
  ListRenderItemInfo,
  RefreshControl,
  View,
  ViewStyle,
} from "react-native"
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
import { useFavourites } from "@/state/favourites/selectors"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import { useDebouncedValue } from "@/utils/useDebounced"

export const EventsScreen = () => {
  const { themed } = useAppTheme()
  const queryClient = useQueryClient()

  const [search, setSearch] = useState("")
  const debouncedSearch = useDebouncedValue(search, 400)
  const {
    theme: { colors },
  } = useAppTheme()
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
    ...getInfinityQueryOptions(debouncedSearch),
    select: (data) => {
      const arr = data.pages.flatMap((page) => page.data?._embedded?.events || [])
      return arr.map((el) => toEventDetailsView(el, 88, "4_3"))
    },
  })

  const onRefresh = useCallback(async () => {
    const { queryKey } = getInfinityQueryOptions(debouncedSearch)

    queryClient.setQueryData(queryKey, (old) =>
      old ? { pages: old.pages.slice(0, 1), pageParams: old.pageParams.slice(0, 1) } : old,
    )

    await Promise.all([
      refetch(),
      queryClient.invalidateQueries({ queryKey: EVENT_KEYS.details() }),
    ])
  }, [queryClient, refetch, debouncedSearch])

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
    <Screen preset={"fixed"} style={themed($container)} safeAreaEdges={["bottom"]}>
      <ListHeader
        hasFavourites={Boolean(favourites.length)}
        goToFavourites={goToFavourites}
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        contentContainerStyle={themed($contentContainerList)}
        data={data || []}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={onRefresh}
            tintColor={colors.tint}
            titleColor={colors.textDim}
            colors={[colors.tint]}
            progressBackgroundColor={colors.background}
          />
        }
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
  value: string
  onChangeText: (t: string) => void
}

const ListHeader: FC<ListHeaderProps> = ({
  hasFavourites,
  goToFavourites,
  value,
  onChangeText,
}) => {
  const { themed } = useAppTheme()
  return (
    <View style={themed($header)}>
      {hasFavourites ? (
        <View style={themed($favouriteSection)}>
          <Button onPress={goToFavourites} tx="eventsScreen:favourites" />
        </View>
      ) : null}
      <TextField
        accessibilityRole={"search"}
        value={value}
        onChangeText={onChangeText}
        labelTx="eventsScreen:search"
        placeholderTx="eventsScreen:placeholder"
      />
    </View>
  )
}

const $header: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.background,
  gap: spacing.sm,
  paddingBottom: spacing.md,
})

const $favouriteSection: ThemedStyle<ViewStyle> = () => ({
  alignItems: "flex-end",
})
