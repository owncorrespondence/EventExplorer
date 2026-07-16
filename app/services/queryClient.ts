import { QueryClient } from "@tanstack/react-query"

import { ApiError } from "@/utils/errors"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (count, error) => {
        const status = (error as ApiError).status
        if (status && status >= 400 && status < 500 && status !== 429) return false
        return count < 3
      },
      retryDelay: (attempt, error) =>
        (error as ApiError).retryAfterMs ?? Math.min(1000 * 2 ** attempt, 30_000),
    },
  },
})
