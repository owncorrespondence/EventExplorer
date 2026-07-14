import { ComponentProps } from "react"
import {
  CompositeScreenProps,
  NavigationContainer,
  NavigatorScreenParams,
} from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"

// App Stack Navigator types
export type AppStackParamList = {
  [ROUTES.WELCOME]: undefined
  [ROUTES.LOGIN]: undefined
  [ROUTES.EVENTS_NAVIGATOR]: NavigatorScreenParams<EventstackParamList>
}

export const ROUTES = {
  LOGIN: "Login",
  WELCOME: "Welcome",
  EVENTS: "Events",
  EVENT_DETAILS: "EventDetails",
  EVENTS_NAVIGATOR: "EventsNavigator",
  FAVOURITE_EVENTS: "FavouriteEvents",
} as const

export type Routes = typeof ROUTES

export type EventstackParamList = {
  [ROUTES.EVENTS]: undefined
  [ROUTES.EVENT_DETAILS]: {
    eventId: string
  }
  [ROUTES.FAVOURITE_EVENTS]: undefined
}
export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>

export type EventsStackScreenProps<T extends keyof EventstackParamList> = CompositeScreenProps<
  NativeStackScreenProps<EventstackParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>

export interface NavigationProps extends Partial<
  ComponentProps<typeof NavigationContainer<AppStackParamList>>
> {}
