import { useCallback } from "react"
import { useNavigation } from "@react-navigation/native"

import { Button } from "@/components/Button"
import { $container } from "@/components/layout"
import { Screen } from "@/components/Screen"
import { EventsStackScreenProps, Routes, ROUTES } from "@/navigators/navigationTypes"
import { FavouriteEvents } from "@/screens/Events/containers/FavouriteEvents"
import { useClearFavourite } from "@/state/favourites/selectors"
import { useAppTheme } from "@/theme/context"

export const FavouriteEventsScreen = () => {
  const { themed } = useAppTheme()
  const navigation =
    useNavigation<EventsStackScreenProps<Routes["FAVOURITE_EVENTS"]>["navigation"]>()

  const clearFavourite = useClearFavourite()

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
      <Button onPress={clearFavourite} text={"Clear "} />

      <FavouriteEvents goToSearch={goToEventSearch} goToEvent={goToEvent} />
    </Screen>
  )
}
