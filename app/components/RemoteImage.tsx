import { memo, useState } from "react"
import { View, ViewStyle, StyleSheet } from "react-native"
import { Image, ImageProps } from "expo-image"

import { SvgPlaceholder } from "@/components/Placeholder"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"

interface RemoteImageProps extends Omit<ImageProps, "source" | "placeholder" | "style"> {
  uri?: string
  size?: number
  radius?: number
  style?: ViewStyle
}

const RemoteImage = memo(({ uri, size = 88, radius = 8, style, ...rest }: RemoteImageProps) => {
  const { themed } = useAppTheme()
  const [loaded, setLoaded] = useState(false)
  const [errored, setErrored] = useState(false)

  const showPlaceholder = !uri || errored || !loaded

  return (
    <View style={[themed($container(size, radius)), style]}>
      {/* SVG placeholder — visible while loading or on error/missing */}
      {showPlaceholder && (
        <View style={[StyleSheet.absoluteFill, $center]}>
          <SvgPlaceholder size={size} />
        </View>
      )}

      {/* real image — only when we have a uri and it hasn't errored */}
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
})

const $container =
  (size: number, radius: number): ThemedStyle<ViewStyle> =>
  ({ colors }) => ({
    width: size,
    height: size,
    borderRadius: radius,
    backgroundColor: colors.palette.neutral300,
    overflow: "hidden",
  })

RemoteImage.displayName = "RemoteImage"

const $center: ViewStyle = { alignItems: "center", justifyContent: "center" }

export { RemoteImage }
