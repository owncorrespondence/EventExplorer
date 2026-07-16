import { FC, JSX, memo } from "react"
import { Pressable, PressableStateCallbackType, StyleProp, View, ViewStyle } from "react-native"

import { $content, $subtitle } from "@/components/layout"
import { RemoteImage } from "@/components/RemoteImage"
import { Text } from "@/components/Text"
import { EventDetailsView } from "@/services/api/event/eventMappers"
import { TicketmasterEvent } from "@/services/api/event/types"
import { useAppTheme } from "@/theme/context"
import { $styles } from "@/theme/styles"
import type { ThemedStyle, ThemedStyleArray } from "@/theme/types"

interface EventCardProps {
  item: EventDetailsView
  onItemPress: (eventId: TicketmasterEvent["id"]) => void
  rightIcon?: JSX.Element
}

const IMAGE_SIZE = 88

export const ITEM_HEIGHT = 112

export const EventCard: FC<EventCardProps> = memo(({ item, onItemPress, rightIcon = null }) => {
  const { themed } = useAppTheme()

  function $viewStyle({ pressed }: PressableStateCallbackType): StyleProp<ViewStyle> {
    return [themed($viewPresets), !!pressed && themed([$pressedViewPresets])]
  }

  const handlePress = () => {
    onItemPress(item.id)
  }

  return (
    <Pressable style={$viewStyle} onPress={handlePress}>
      <RemoteImage uri={item.heroImage} size={IMAGE_SIZE} radius={8} />
      <View style={themed($rightBlock)}>
        <View style={themed($eventInfoBlock)}>
          <Text numberOfLines={2} style={themed($subtitle)}>
            {item.name}
          </Text>
          {item.dateInfo?.date ? (
            <Text style={[themed($content), $styles.muted]}>{item.dateInfo?.date}</Text>
          ) : null}
        </View>
        {rightIcon}
      </View>
    </Pressable>
  )
})
EventCard.displayName = "EventRow"

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
    height: ITEM_HEIGHT,
    flexDirection: "row",
    ...elevation.subtle,
  }),
]

const $pressedViewPresets: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.neutral200,
})
