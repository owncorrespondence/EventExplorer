import { FC } from "react"
import { FlatList } from "react-native"

import { EmptyState } from "@/components/EmptyState"
import { $contentContainerList } from "@/components/layout"
import { FavouritesEventCard } from "@/screens/Events/components/FavouritesEventCard"
import { useFavourites } from "@/state/favourites/selectors"
import { useAppTheme } from "@/theme/context"

interface FavouriteEventsContainerProps {
  goToSearch: () => void
  goToEvent: (eventId: string) => void
}
export const FavouriteEvents: FC<FavouriteEventsContainerProps> = ({ goToSearch, goToEvent }) => {
  const { themed } = useAppTheme()
  const favourites = useFavourites()

  return (
    <FlatList
      data={favourites}
      contentContainerStyle={themed($contentContainerList)}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <FavouritesEventCard item={item} onItemPress={goToEvent} />}
      ListEmptyComponent={
        <EmptyState
          buttonTx={"favouriteEventsScreen:button.title"}
          buttonOnPress={goToSearch}
          content={undefined}
        />
      }
    />
  )
}
