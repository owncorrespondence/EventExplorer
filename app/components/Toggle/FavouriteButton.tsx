import { memo, useEffect } from "react"
import { Pressable, ViewStyle } from "react-native"
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated"
import Svg, { Path } from "react-native-svg"

import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"

const AnimatedPath = Animated.createAnimatedComponent(Path)

// Material heart path on a 24×24 viewBox
const HEART_PATH =
  "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"

interface FavouriteButtonProps {
  liked: boolean
  onToggle: () => void
  size?: number
}

const FavouriteButton = memo(({ liked, onToggle, size = 24 }: FavouriteButtonProps) => {
  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  const progress = useSharedValue(liked ? 1 : 0) // 0 = empty, 1 = filled
  const scale = useSharedValue(1)

  useEffect(() => {
    progress.value = withTiming(liked ? 1 : 0, { duration: 200 })
    scale.value = withSequence(
      withTiming(liked ? 1.3 : 0.8, { duration: 120 }),
      withSpring(1, { damping: 6, stiffness: 200 }),
    )
  }, [liked, progress, scale])

  const animatedProps = useAnimatedProps(() => ({
    fillOpacity: progress.value,
  }))

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  return (
    <Pressable onPress={onToggle} hitSlop={10} style={themed($button)}>
      <Animated.View style={containerStyle}>
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <AnimatedPath
            d={HEART_PATH}
            fill={liked ? colors.tint : colors.tintInactive}
            stroke={liked ? colors.tint : colors.tintInactive}
            strokeWidth={2}
            animatedProps={animatedProps}
          />
        </Svg>
      </Animated.View>
    </Pressable>
  )
})

FavouriteButton.displayName = "FavouriteButton"

const $button: ThemedStyle<ViewStyle> = ({ spacing }) => ({ flexShrink: 0, padding: spacing.xxxs })

export { FavouriteButton }
