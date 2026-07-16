import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

import { EventDetailsView } from "@/services/api/event/eventMappers"
import { zustandMMKVStorage } from "@/utils/storage"

interface FavouriteEvent extends EventDetailsView {
  savedAt: number
}

interface FavouritesState {
  favourites: Record<string, FavouriteEvent>
  add: (event: FavouriteEvent) => void
  remove: (id: string) => void
  toggle: (event: FavouriteEvent) => void
  clear: () => void
}

export const useFavouritesStore = create<FavouritesState>()(
  persist(
    (set, get) => ({
      favourites: {},
      add: (event) => set((s) => ({ favourites: { ...s.favourites, [event.id]: event } })),
      remove: (id) =>
        set((s) => {
          const next = { ...s.favourites }
          delete next[id]
          return { favourites: next }
        }),
      toggle: (event) => (get().favourites[event.id] ? get().remove(event.id) : get().add(event)),
      clear: () =>
        set({
          favourites: {},
        }),
    }),
    {
      name: "favourites",
      storage: createJSONStorage(() => zustandMMKVStorage),
      version: 1, // bump + add `migrate` if the shape changes later
    },
  ),
)
