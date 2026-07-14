import { useCallback } from "react"
import { LayoutAnimation } from "react-native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import { Button } from "@/components/Button"
import { EventsDetailsScreen } from "@/screens/Events/EventsDetailsScreen"
import { EventsScreen } from "@/screens/Events/EventsScreen"
import { FavouriteEventsScreen } from "@/screens/Events/FavouriteEventsScreen"
import { useAppTheme } from "@/theme/context"

import { EventstackParamList, ROUTES } from "./navigationTypes"

const EventsStack = createNativeStackNavigator<EventstackParamList>()
export function EventsNavigator() {
  const { setThemeContextOverride, themeContext } = useAppTheme()

  const toggleTheme = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setThemeContextOverride(themeContext === "dark" ? "light" : "dark")
  }, [themeContext, setThemeContextOverride])

  return (
    <EventsStack.Navigator>
      <EventsStack.Screen
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
      <EventsStack.Screen name={ROUTES.EVENT_DETAILS} component={EventsDetailsScreen} />
      <EventsStack.Screen name={ROUTES.FAVOURITE_EVENTS} component={FavouriteEventsScreen} />
    </EventsStack.Navigator>
  )
}
