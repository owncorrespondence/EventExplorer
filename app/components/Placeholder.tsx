import Svg, { Path, Rect } from "react-native-svg"

import { useAppTheme } from "@/theme/context"

export const SvgPlaceholder = ({ size }: { size: number }) => {
  const {
    theme: { colors },
  } = useAppTheme()
  return (
    <Svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24">
      <Rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="2"
        fill="none"
        stroke={colors.textDim}
        strokeWidth={2}
      />
      <Path d="M3 16l5-5 4 4 3-3 6 6" fill="none" stroke={colors.textDim} strokeWidth={2} />
    </Svg>
  )
}
