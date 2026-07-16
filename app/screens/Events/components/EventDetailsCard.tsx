import { View, ViewStyle } from "react-native"

import { $content, $title } from "@/components/layout"
import { Tag } from "@/components/Tag"
import { Text } from "@/components/Text"
import { FavouriteButton } from "@/components/Toggle/FavouriteButton"
import { EventDetailsView } from "@/services/api/event/eventMappers"
import { useAppTheme } from "@/theme/context"
import { $styles } from "@/theme/styles"
import { ThemedStyle } from "@/theme/types"

interface EventDetailsCardProps {
  data: EventDetailsView
  handleFavouritePress: (data: EventDetailsView) => void
  isFavourite: boolean
}
export const EventDetailsCard: React.FC<EventDetailsCardProps> = ({
  data,
  isFavourite,
  handleFavouritePress,
}) => {
  const { themed } = useAppTheme()

  return (
    <View style={themed($contentList)}>
      <View style={[$styles.row, themed($favouriteContainer)]}>
        <View style={[$styles.row, themed($favouritesBlock)]}>
          <Text
            style={themed($content)}
            tx={isFavourite ? "eventDetailsScreen:saved" : "eventDetailsScreen:save"}
          />
          <FavouriteButton liked={isFavourite} onToggle={() => handleFavouritePress(data)} />
        </View>
      </View>
      <Text style={themed($title)} numberOfLines={3}>
        {data.name}
      </Text>
      {data.dateInfo.date ? <Text style={themed($content)}>{data.dateInfo.date}</Text> : null}
      {data.dateInfo.time ? <Text style={themed($content)}>{data.dateInfo.time}</Text> : null}
      {data?.venue?.name ? <Text style={themed($content)}>{data.venue?.name}</Text> : null}
      {data?.venue?.cityCountry ? (
        <Text style={themed($content)}>{data.venue?.cityCountry}</Text>
      ) : null}
      {data?.tags?.length ? (
        <View style={themed($tagList)}>
          {data.tags.map((el) => {
            return <Tag key={el} label={el} />
          })}
        </View>
      ) : null}
      {data?.price ? <Text>{data.price}</Text> : null}
    </View>
  )
}

const $favouriteContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  justifyContent: "flex-end",
})

const $favouritesBlock: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.md,
})

const $tagList: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.xs,
  flexDirection: "row",
})

const $contentList: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.sm,
  padding: spacing.md,
})
