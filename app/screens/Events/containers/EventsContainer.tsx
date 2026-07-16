import { FC, useState } from "react"

import { ListHeader } from "@/screens/Events/components/ListHeader"
import { EventsList } from "@/screens/Events/containers/EventsList"
import { useFavourites } from "@/state/favourites/selectors"
import { useDebouncedValue } from "@/utils/useDebounced"

interface EventsContainerProps {
  goToEvent: (eventId: string) => void
  goToFavourites: () => void
}

export const EventsContainer: FC<EventsContainerProps> = ({ goToEvent, goToFavourites }) => {
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebouncedValue(search, 400)
  const favourites = useFavourites()

  return (
    <>
      <ListHeader
        hasFavourites={Boolean(favourites.length)}
        goToFavourites={goToFavourites}
        value={search}
        onChangeText={setSearch}
      />
      <EventsList goToEvent={goToEvent} search={debouncedSearch} />
    </>
  )
}

EventsContainer.displayName = "EventsContainer"
