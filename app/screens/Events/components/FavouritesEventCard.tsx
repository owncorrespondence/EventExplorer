import { FC } from "react"
import { Pressable } from "react-native"

import { EventCard } from "@/components/EventCard"
import { Icon } from "@/components/Icon"
import { EventDetailsView } from "@/services/api/event/eventMappers"
import { useRemoveFavourite } from "@/state/favourites/selectors"

interface FavouritesEventCardProps {
  item: EventDetailsView
  onItemPress: (eventId: string) => void
}

export const FavouritesEventCard: FC<FavouritesEventCardProps> = ({ item, onItemPress }) => {
  const remove = useRemoveFavourite()

  const handleFavouritesPress = () => {
    remove(item.id)
  }

  return (
    <EventCard
      item={item}
      onItemPress={onItemPress}
      rightIcon={<RemoveButton onPress={handleFavouritesPress} />}
    />
  )
}

interface RemoveButtonProps {
  onPress: () => void
}

const RemoveButton: FC<RemoveButtonProps> = ({ onPress }) => {
  return (
    <Pressable onPress={() => onPress()}>
      <Icon icon={"x"} />
    </Pressable>
  )
}

FavouritesEventCard.displayName = "SearchEventCard"
