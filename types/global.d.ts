export {};

declare global {
  /** * React Children Prop */
  type CP<P = unknown> = P & { children?: React.ReactNode };
}
