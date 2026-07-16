import { FC, memo } from "react"

import { EventCard } from "@/components/EventCard"
import { FavouriteButton } from "@/components/Toggle/FavouriteButton"
import { EventDetailsView } from "@/services/api/event/eventMappers"
import { useIsFavourite, useToggleFavourite } from "@/state/favourites/selectors"

interface SearchEventCardProps {
  item: EventDetailsView
  onItemPress: (eventId: string) => void
}

export const SearchEventCard: FC<SearchEventCardProps> = memo(({ item, onItemPress }) => {
  const favourite = useIsFavourite(item.id)
  const toggle = useToggleFavourite()

  const handleFavouritesPress = () => {
    toggle({
      id: item.id,
      name: item.name,
      heroImage: item.heroImage,
      dateInfo: item.dateInfo,
      tags: item.tags,
      savedAt: Date.now(),
    })
  }
  return (
    <EventCard
      item={item}
      onItemPress={onItemPress}
      rightIcon={<FavouriteButton liked={favourite} onToggle={handleFavouritesPress} />}
    />
  )
})

SearchEventCard.displayName = "SearchEventCard"
