/* eslint-disable @typescript-eslint/no-explicit-any */

export function checkTouchEvent(event: any): asserts event is TouchEvent {
  if ("touches" in event)
    throw new Error(
      `Responce with an error from the server doesn't match the type of error: ${event}`
    );
}
