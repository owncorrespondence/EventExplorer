import { useCallback } from "react"
import { FlatList } from "react-native"
import { useNavigation } from "@react-navigation/native"

import { EmptyState } from "@/components/EmptyState"
import { $container, $contentContainerList } from "@/components/layout"
import { Screen } from "@/components/Screen"
import { EventsStackScreenProps, Routes, ROUTES } from "@/navigators/navigationTypes"
import { FavouritesEventCard } from "@/screens/Events/components/FavouritesEventCard"
import { useFavourites } from "@/state/favourites/selectors"
import { useAppTheme } from "@/theme/context"

export const FavouriteEventsScreen = () => {
  const { themed } = useAppTheme()
  const favourites = useFavourites()
  const navigation =
    useNavigation<EventsStackScreenProps<Routes["FAVOURITE_EVENTS"]>["navigation"]>()
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

  const goToEventSearch = useCallback(() => {
    navigation.replace(ROUTES.EVENTS_NAVIGATOR, {
      screen: ROUTES.EVENTS,
    })
  }, [navigation])

  return (
    <Screen preset={"fixed"} style={themed($container)}>
      <FlatList
        data={favourites}
        contentContainerStyle={themed($contentContainerList)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <FavouritesEventCard item={item} onItemPress={goToEvent} />}
        ListEmptyComponent={
          <EmptyState
            buttonTx={"favouriteEventsScreen:button.title"}
            buttonOnPress={goToEventSearch}
            content={undefined}
          />
        }
      />
    </Screen>
  )
}
