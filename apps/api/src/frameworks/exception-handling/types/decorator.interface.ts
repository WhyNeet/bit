export type Decorator = (
  ...args: unknown[]
) => <T extends abstract new (...args: unknown[]) => object>(
  target: T,
  propertyKey: string,
) => void;
