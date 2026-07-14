import { useShallow } from "zustand/react/shallow"

import { useFavouritesStore } from "./favouritesStore"

export const useIsFavourite = (id: string) => useFavouritesStore((s) => Boolean(s.favourites[id]))

export const useFavourites = () =>
  useFavouritesStore(
    useShallow((s) => Object.values(s.favourites).sort((a, b) => b.savedAt - a.savedAt)),
  )
export const useToggleFavourite = () => useFavouritesStore((s) => s.toggle)
export const useRemoveFavourite = () => useFavouritesStore((s) => s.remove)
