import { AxiosError } from "axios";
import { ServerError } from "types";

export const checkAxiosError = <
  R extends AxiosError<ServerError> = AxiosError<ServerError>
>(
  e: unknown
): R | undefined => ("response" in (e as R) ? (e as R) : undefined);
