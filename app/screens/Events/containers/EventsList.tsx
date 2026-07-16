import { FC, memo, useCallback } from "react"
import {
  ActivityIndicator,
  FlatList,
  ListRenderItemInfo,
  RefreshControl,
  ViewStyle,
} from "react-native"
import { InfiniteData, useInfiniteQuery, useQueryClient } from "@tanstack/react-query"
import { ApiResponse } from "apisauce"

import { Button } from "@/components/Button"
import { EmptyState } from "@/components/EmptyState"
import { ITEM_HEIGHT } from "@/components/EventCard"
import { $contentContainerList } from "@/components/layout"
import { SearchEventCard } from "@/screens/Events/components/SearchEventCard"
import { EventDetailsView, toEventDetailsView } from "@/services/api/event/eventMappers"
import { EVENT_KEYS } from "@/services/api/event/eventsKeys"
import { getInfinityQueryOptions } from "@/services/api/event/queryOptions"
import { EventsSearchResponse } from "@/services/api/event/types"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import { ApiError } from "@/utils/errors"

const LIST_GAP = 12

const STRIDE = ITEM_HEIGHT + LIST_GAP

interface EventsListContainerProps {
  goToEvent: (eventId: string) => void
  search?: string
}
export const EventsList: FC<EventsListContainerProps> = memo(({ goToEvent, search }) => {
  const { themed } = useAppTheme()
  const queryClient = useQueryClient()

  const {
    theme: { colors },
  } = useAppTheme()

  const select = useCallback(
    (data: InfiniteData<ApiResponse<EventsSearchResponse>>) =>
      data.pages
        .flatMap((page) => page.data?._embedded?.events ?? [])
        .map((el) => toEventDetailsView(el, 88, "4_3")),
    [],
  )

  const {
    data,
    isError,
    isLoading,
    isRefetching,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    error,
  } = useInfiniteQuery({
    ...getInfinityQueryOptions(search),
    select,
  })

  const onRefresh = useCallback(async () => {
    const { queryKey } = getInfinityQueryOptions(search)
    queryClient.setQueryData(queryKey, (old) =>
      old ? { pages: old.pages.slice(0, 1), pageParams: old.pageParams.slice(0, 1) } : old,
    )
    await Promise.all([
      refetch(),
      queryClient.invalidateQueries({ queryKey: EVENT_KEYS.details() }),
    ])
  }, [queryClient, refetch, search])

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<EventDetailsView>) => (
      <SearchEventCard item={item} onItemPress={goToEvent} />
    ),
    [goToEvent],
  )
  const extractKey = useCallback((item: EventDetailsView) => item.id, [])

  if (isLoading || (isRefetching && isError)) {
    return <ActivityIndicator />
  }

  if (isError && !data?.length) {
    return (
      <EmptyState
        headingTx="emptyStateComponent:generic.heading"
        contentTx={(error as ApiError)?.messageTx || "errors:generic"}
        buttonTx="emptyStateComponent:generic.button"
        buttonOnPress={() => refetch()}
      />
    )
  }

  return (
    <FlatList
      contentContainerStyle={themed($contentContainerList)}
      data={data || []}
      getItemLayout={(_, index) => ({
        length: ITEM_HEIGHT,
        offset: STRIDE * index,
        index,
      })}
      initialNumToRender={8}
      maxToRenderPerBatch={8}
      windowSize={11}
      removeClippedSubviews

      onEndReachedThreshold={0.5}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage && !isFetchNextPageError) {
          fetchNextPage()
        }
      }}
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
      ListFooterComponent={
        isFetchNextPageError && !isFetchingNextPage ? (
          <Button tx="eventsScreen:retryLoadMore" onPress={() => fetchNextPage()} />
        ) : isFetchingNextPage ? (
          <ActivityIndicator style={themed($activityIndicator)} />
        ) : null
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
  )
})

EventsList.displayName = "EventsList"

const $activityIndicator: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.md,
})
