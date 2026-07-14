import { ViewStyle } from "react-native"

export const elevation = {
  none: {
    boxShadow: "none",
  },
  subtle: {
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.08)",
  },
  medium: {
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.10)",
  },
  high: {
    boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.14)",
  },
} satisfies Record<string, ViewStyle>

export type ElevationLevel = keyof typeof elevation
