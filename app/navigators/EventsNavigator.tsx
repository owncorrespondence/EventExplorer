import { useCallback } from "react"
import { LayoutAnimation } from "react-native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import { Button } from "@/components/Button"
import { EventsDetailsScreen } from "@/screens/Events/EventsDetailsScreen"
import { EventsScreen } from "@/screens/Events/EventsScreen"
import { useAppTheme } from "@/theme/context"

import { DemoStackParamList, ROUTES } from "./navigationTypes"

/**
 * This is the main navigator for the demo screens with a bottom tab bar.
 * Each tab is a stack navigator with its own set of screens.
 *
 * More info: https://reactnavigation.org/docs/bottom-tab-navigator/
 * @returns {JSX.Element} The rendered `DemoNavigator`.
 *
 */

const DemoStack = createNativeStackNavigator<DemoStackParamList>()
export function EventsNavigator() {
  const { setThemeContextOverride, themeContext } = useAppTheme()

  const toggleTheme = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut) // Animate the transition
    setThemeContextOverride(themeContext === "dark" ? "light" : "dark")
  }, [themeContext, setThemeContextOverride])

  return (
    <DemoStack.Navigator>
      <DemoStack.Screen
        name={ROUTES.EVENTS}
        component={EventsScreen}
        options={{
          headerRight: () => (
            <Button
              onPress={toggleTheme}
              tx={"common:toggleTheme"}
              txOptions={{ theme: themeContext }}
            />
          ),
        }}
      />
      <DemoStack.Screen name={ROUTES.EVENT_DETAILS} component={EventsDetailsScreen} />
    </DemoStack.Navigator>
  )
}
