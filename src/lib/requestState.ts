// FE-092: Shared request-state types for dashboard KPIs and charts

export type RequestState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: T };

export function isLoading<T>(state: RequestState<T>): boolean {
  return state.status === "loading";
}

export function isError<T>(state: RequestState<T>): boolean {
  return state.status === "error";
}

export function isEmpty<T extends unknown[]>(state: RequestState<T>): boolean {
  return state.status === "success" && state.data.length === 0;
}

export function getErrorMessage<T>(state: RequestState<T>): string {
  return state.status === "error" ? state.message : "";
}