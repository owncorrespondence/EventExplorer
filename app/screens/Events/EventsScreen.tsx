import { useCallback } from "react"
import { useNavigation } from "@react-navigation/native"

import { $container } from "@/components/layout"
import { Screen } from "@/components/Screen"
import { EventsStackScreenProps, ROUTES, Routes } from "@/navigators/navigationTypes"
import { EventsContainer } from "@/screens/Events/containers/EventsContainer"
import { useAppTheme } from "@/theme/context"

export const EventsScreen = () => {
  const { themed } = useAppTheme()

  const navigation = useNavigation<EventsStackScreenProps<Routes["EVENTS"]>["navigation"]>()

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

  return (
    <Screen preset={"fixed"} style={themed($container)} safeAreaEdges={["bottom"]}>
      <EventsContainer goToEvent={goToEvent} goToFavourites={goToFavourites} />
    </Screen>
  )
}
