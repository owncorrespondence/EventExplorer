import { ComponentProps } from "react"
import {
  CompositeScreenProps,
  NavigationContainer,
  NavigatorScreenParams,
} from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"

// Demo Tab Navigator types
export type DemoTabParamList = {
  DemoCommunity: undefined
  DemoShowroom: { queryIndex?: string; itemIndex?: string }
  DemoDebug: undefined
  DemoPodcastList: undefined
}

// App Stack Navigator types
export type AppStackParamList = {
  Welcome: undefined
  Login: undefined
  [ROUTES.EVENTS_NAVIGATOR]: NavigatorScreenParams<DemoStackParamList>
}

export const ROUTES = {
  EVENTS: "Events",
  EVENT_DETAILS: "EventDetails",
  EVENTS_NAVIGATOR: "EventsNavigator",
} as const

export type Routes = typeof ROUTES

// usage

export type DemoStackParamList = {
  [ROUTES.EVENTS]: undefined
  [ROUTES.EVENT_DETAILS]: {
    eventId: string
  }
}
export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>

export type EventsStackScreenProps<T extends keyof DemoStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<DemoStackParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>

export interface NavigationProps extends Partial<
  ComponentProps<typeof NavigationContainer<AppStackParamList>>
> {}
