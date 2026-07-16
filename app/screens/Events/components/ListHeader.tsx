import { FC } from "react"
import { View, ViewStyle } from "react-native"

import { Button } from "@/components/Button"
import { TextField } from "@/components/TextField"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"

interface ListHeaderProps {
  goToFavourites?: () => void
  hasFavourites?: boolean
  value: string
  onChangeText: (t: string) => void
}

export const ListHeader: FC<ListHeaderProps> = ({
  hasFavourites,
  goToFavourites,
  value,
  onChangeText,
}) => {
  const { themed } = useAppTheme()
  return (
    <View style={themed($header)}>
      {hasFavourites ? (
        <View style={themed($favouriteSection)}>
          <Button onPress={goToFavourites} tx="eventsScreen:favourites" />
        </View>
      ) : null}
      <TextField
        accessibilityRole={"search"}
        value={value}
        onChangeText={onChangeText}
        labelTx="eventsScreen:search"
        placeholderTx="eventsScreen:placeholder"
      />
    </View>
  )
}

const $header: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.background,
  gap: spacing.sm,
  paddingBottom: spacing.md,
})

const $favouriteSection: ThemedStyle<ViewStyle> = () => ({
  alignItems: "flex-end",
})
