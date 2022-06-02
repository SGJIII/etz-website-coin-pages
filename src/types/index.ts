export type HTMLElementEvent<T extends HTMLInputElement> = Omit<
  Event,
  "currentTarget"
> & {
  currentTarget: (EventTarget & { value?: T["value"] }) | null;
};
