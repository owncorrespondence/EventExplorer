import { useCallback } from "react"
import { LayoutAnimation } from "react-native"

import { Button } from "@/components/Button"
import { useAppTheme } from "@/theme/context"

export const ThemeSwitcher = () => {
  const { setThemeContextOverride, themeContext } = useAppTheme()

  const toggleTheme = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setThemeContextOverride(themeContext === "dark" ? "light" : "dark")
  }, [themeContext, setThemeContextOverride])

  return (
    <Button
      onPress={toggleTheme}
      preset={"default"}
      tx={"common:toggleTheme"}
      txOptions={{ theme: themeContext }}
      accessibilityHint={"Change theme"}
    />
  )
}
