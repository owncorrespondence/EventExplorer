import { TextStyle, ViewStyle } from "react-native"

import type { ThemedStyle } from "@/theme/types"

export const $title: ThemedStyle<TextStyle> = ({ typography }) => ({
  fontFamily: typography.primary.bold,
  fontSize: typography.sizes.title,
})
export const $subtitle: ThemedStyle<TextStyle> = ({ typography }) => ({
  fontFamily: typography.primary.semiBold,
  fontSize: typography.sizes.subTitle,
})
export const $content: ThemedStyle<TextStyle> = ({ typography }) => ({
  fontFamily: typography.primary.normal,
  fontSize: typography.sizes.body,
})
export const $contentContainerList: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.sm,
})

export const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.md,
})

export const $globalLoadingContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.md,
  justifyContent: "center",
})
