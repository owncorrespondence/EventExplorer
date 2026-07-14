import { useCallback } from "react"
import { ActivityIndicator, FlatList, ListRenderItemInfo, View, ViewStyle } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query"

import { EventRow } from "@/components/EventRow"
import { EventsStackScreenProps, ROUTES, Routes } from "@/navigators/navigationTypes"
import { EVENT_KEYS } from "@/services/api/event/eventsKeys"
import { getInfinityQueryOptions } from "@/services/api/event/queryOptions"
import { TicketmasterEvent } from "@/services/api/event/types"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"

export const EventsScreen = () => {
  const { themed } = useAppTheme()
  const queryclient = useQueryClient()
  const navigation = useNavigation<EventsStackScreenProps<Routes["EVENTS"]>["navigation"]>()

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
      return data.pages.flatMap((page) => page.data?._embedded?.events || [])
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

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<TicketmasterEvent>) => (
      <EventRow item={item} onItemPress={goToEvent} />
    ),
    [goToEvent],
  )
  const extractKey = useCallback((item: TicketmasterEvent) => item.id, [])

  if (isLoading) {
    return <ActivityIndicator />
  }

  if (isError) {
    return null
  }
  return (
    <View style={themed($container)}>
      <FlatList
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
        ListEmptyComponent={isLoading ? <ActivityIndicator /> : null}
        renderItem={renderItem}
      />
    </View>
  )
}
const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  paddingHorizontal: spacing.md,
})

const $activityIndicator: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.md,
})

const $contentContainerList: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.sm,
})
