import { FC } from "react"
import { TextStyle, View, ViewStyle } from "react-native"

import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"

interface TagProps {
  label: string
}
export const Tag: FC<TagProps> = ({ label }) => {
  const { themed } = useAppTheme()
  return (
    <View style={themed($container)}>
      <Text style={themed($text)}>{label}</Text>
    </View>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ spacing, colors, borderRadius }) => {
  return {
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.tint,
    borderRadius: borderRadius.small,
  }
}

const $text: ThemedStyle<TextStyle> = ({ typography, colors }) => {
  return {
    fontFamily: typography.primary.normal,
    color: colors.tag,
  }
}
