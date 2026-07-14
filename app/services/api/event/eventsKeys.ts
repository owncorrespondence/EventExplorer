export const EVENT_KEYS = {
  all: ["events"] as const,
  lists: () => [...EVENT_KEYS.all, "lists"] as const,
  list: (filters: string) => [...EVENT_KEYS.lists(), { filters }] as const,
  details: () => [...EVENT_KEYS.all, "details"] as const,
  detail: (eventId: string) => {
    return [...EVENT_KEYS.details(), eventId] as const
  },
}
