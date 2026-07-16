import { View, ViewStyle } from "react-native"
import { useRoute } from "@react-navigation/native"

import { EventsStackScreenProps, Routes } from "@/navigators/navigationTypes"
import { EventDetails } from "@/screens/Events/containers/EventDetails"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import { useSafeAreaInsetsStyle } from "@/utils/useSafeAreaInsetsStyle"

export const EventsDetailsScreen = () => {
  const { themed } = useAppTheme()
  const $containerInsets = useSafeAreaInsetsStyle(["bottom"])
  const { params } = useRoute<EventsStackScreenProps<Routes["EVENT_DETAILS"]>["route"]>()

  return (
    <View style={[themed($container), $containerInsets]}>
      <EventDetails eventId={params.eventId} />
    </View>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  flex: 1,
  padding: spacing.md,
  backgroundColor: colors?.background,
})
