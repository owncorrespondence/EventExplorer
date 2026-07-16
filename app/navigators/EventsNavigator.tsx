import { createNativeStackNavigator } from "@react-navigation/native-stack"

import { ThemeSwitcher } from "@/components/Toggle/ThemeSwitch"
import { EventsDetailsScreen } from "@/screens/Events/EventsDetailsScreen"
import { EventsScreen } from "@/screens/Events/EventsScreen"
import { FavouriteEventsScreen } from "@/screens/Events/FavouriteEventsScreen"

import { EventstackParamList, ROUTES } from "./navigationTypes"

const EventsStack = createNativeStackNavigator<EventstackParamList>()
export function EventsNavigator() {
  return (
    <EventsStack.Navigator
      screenOptions={{
        headerRight: () => <ThemeSwitcher />,
      }}
    >
      <EventsStack.Screen name={ROUTES.EVENTS} component={EventsScreen} />
      <EventsStack.Screen name={ROUTES.EVENT_DETAILS} component={EventsDetailsScreen} />
      <EventsStack.Screen name={ROUTES.FAVOURITE_EVENTS} component={FavouriteEventsScreen} />
    </EventsStack.Navigator>
  )
}
