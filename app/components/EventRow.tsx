import { FC, memo, useCallback, useState } from "react"
import { Pressable, PressableStateCallbackType, StyleProp, View, ViewStyle } from "react-native"

import { $content, $subtitle } from "@/components/layout"
import { RemoteImage } from "@/components/RemoteImage"
import { Text } from "@/components/Text"
import { FavouriteButton } from "@/components/Toggle/FavouriteButton"
import { TicketmasterEvent } from "@/services/api/event/types"
import { useAppTheme } from "@/theme/context"
import { $styles } from "@/theme/styles"
import type { ThemedStyle, ThemedStyleArray } from "@/theme/types"

interface EventRowProps {
  item: TicketmasterEvent
  onItemPress: (eventId: TicketmasterEvent["id"]) => void
}

const IMAGE_SIZE = 88

export const EventRow: FC<EventRowProps> = memo(({ item, onItemPress }) => {
  const [isFavourite, setIsFavourite] = useState<boolean>(false)
  const { themed } = useAppTheme()

  const handleFavouritesPress = useCallback(() => {
    setIsFavourite((prevState) => !prevState)
  }, [])

  function $viewStyle({ pressed }: PressableStateCallbackType): StyleProp<ViewStyle> {
    return [themed($viewPresets), !!pressed && themed([$pressedViewPresets])]
  }

  const handlePress = () => {
    onItemPress(item.id)
  }
  return (
    <Pressable style={$viewStyle} onPress={handlePress}>
      <RemoteImage uri={item.images?.[0]?.url} size={IMAGE_SIZE} radius={8} />
      <View style={themed($rightBlock)}>
        <View style={themed($eventInfoBlock)}>
          <Text numberOfLines={2} style={themed($subtitle)}>
            {item.name}
          </Text>
          <Text style={[themed($content), $styles.muted]}>{item.dates?.start?.localDate}</Text>
        </View>
        <FavouriteButton liked={isFavourite} onToggle={handleFavouritesPress} />
      </View>
    </Pressable>
  )
})
EventRow.displayName = "EventRow"

const $rightBlock: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  flexDirection: "row",
  justifyContent: "space-between",
})

const $eventInfoBlock: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  minWidth: 0,
})

const $viewPresets: ThemedStyleArray<ViewStyle> = [
  ({ colors, spacing, borderRadius, elevation }) => ({
    borderWidth: 1,
    borderRadius: borderRadius.small,
    borderColor: colors.palette.neutral400,
    backgroundColor: colors.palette.neutral100,
    gap: spacing.sm,
    padding: spacing.sm,
    height: 112,
    flexDirection: "row",
    ...elevation.subtle,
  }),
]

const $pressedViewPresets: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.neutral200,
})
