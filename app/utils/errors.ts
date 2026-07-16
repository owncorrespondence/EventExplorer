import type { ApiOkResponse, ApiResponse } from "apisauce"

import type { TxKeyPath } from "@/i18n"

export class ApiError extends Error {
  constructor(
    public status: number | undefined,
    public problem: string | null,
    public messageTx: TxKeyPath,
    public retryAfterMs?: number,
  ) {
    super(messageTx)
    this.name = "ApiError"
  }
}

export function toErrorTx(status?: number, problem?: string | null): TxKeyPath {
  if (problem === "NETWORK_ERROR" || problem === "CONNECTION_ERROR") return "errors:noConnection"
  if (problem === "TIMEOUT_ERROR") return "errors:timeout"
  if (status === 429) return "errors:tooManyRequests"
  if (status === 401 || status === 403) return "errors:accessDenied"
  if (status && status >= 500) return "errors:server"
  if (status && status >= 400) return "errors:badRequest"
  return "errors:generic"
}

export async function withThrowable<T>(
  apiCall: () => Promise<ApiResponse<T>>,
): Promise<ApiOkResponse<T>> {
  const res = await apiCall()

  if (!res.ok) {
    const retryAfter = res.headers?.["retry-after"] as string | undefined // seconds
    throw new ApiError(
      res.status,
      res.problem,
      toErrorTx(res.status, res.problem),
      retryAfter ? Number(retryAfter) * 1000 : undefined,
    )
  }

  return res
}
