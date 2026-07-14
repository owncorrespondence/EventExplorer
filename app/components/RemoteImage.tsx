import { memo, useState } from "react"
import { DimensionValue, StyleProp, StyleSheet, View, ViewStyle } from "react-native"
import { Image, ImageProps } from "expo-image"

import { SvgPlaceholder } from "@/components/Placeholder"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"

interface RemoteImageProps extends Omit<ImageProps, "source" | "placeholder" | "style"> {
  uri?: string
  /** square shorthand — sets width & height to the same value */
  size?: number
  /** explicit width (number or "100%") — use with height or aspectRatio */
  width?: DimensionValue
  /** explicit height */
  height?: DimensionValue
  /** e.g. 16 / 9 for a hero; combine with width="100%" */
  aspectRatio?: number
  radius?: number
  /** icon size for the placeholder; defaults to a sensible value */
  placeholderSize?: number
  style?: StyleProp<ViewStyle>
}

const RemoteImage = memo(
  ({
    uri,
    size,
    width,
    height,
    aspectRatio,
    radius = 8,
    placeholderSize,
    style,
    ...rest
  }: RemoteImageProps) => {
    const { themed } = useAppTheme()
    const [loaded, setLoaded] = useState(false)
    const [errored, setErrored] = useState(false)

    const showPlaceholder = !uri || errored || !loaded

    // resolve dimensions: `size` wins as a square, else width/height/aspectRatio
    const dimensions: ViewStyle =
      size != null ? { width: size, height: size } : { width, height, aspectRatio }

    // placeholder icon: explicit → square size → numeric width/height → fallback
    const iconSize =
      placeholderSize ??
      (typeof size === "number"
        ? size
        : typeof width === "number"
          ? width
          : typeof height === "number"
            ? height
            : 96)

    return (
      <View style={[themed($container(dimensions, radius)), style]}>
        {showPlaceholder && (
          <View style={[StyleSheet.absoluteFill, $center]} pointerEvents="none">
            <SvgPlaceholder size={Math.min(iconSize, 120)} />
          </View>
        )}

        {uri && !errored && (
          <Image
            source={{ uri }}
            contentFit="cover"
            transition={200}
            cachePolicy="memory-disk"
            onLoad={() => setLoaded(true)}
            onError={() => setErrored(true)}
            style={StyleSheet.absoluteFill}
            {...rest}
          />
        )}
      </View>
    )
  },
)

const $container =
  (dimensions: ViewStyle, radius: number): ThemedStyle<ViewStyle> =>
  ({ colors }) => ({
    ...dimensions,
    borderRadius: radius,
    backgroundColor: colors.palette.neutral300,
    overflow: "hidden",
  })

RemoteImage.displayName = "RemoteImage"

const $center: ViewStyle = { alignItems: "center", justifyContent: "center" }

export { RemoteImage }
