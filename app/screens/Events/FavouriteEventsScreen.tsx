import { useCallback } from "react"
import { useNavigation } from "@react-navigation/native"

import { $container } from "@/components/layout"
import { Screen } from "@/components/Screen"
import { EventsStackScreenProps, Routes, ROUTES } from "@/navigators/navigationTypes"
import { FavouriteEvents } from "@/screens/Events/containers/FavouriteEvents"
import { useAppTheme } from "@/theme/context"

export const FavouriteEventsScreen = () => {
  const { themed } = useAppTheme()
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
      <FavouriteEvents goToSearch={goToEventSearch} goToEvent={goToEvent} />
    </Screen>
  )
}
