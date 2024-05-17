export const curve = (...args: number[]) => `cubic-bezier(${args.join(",")})`;

export const quart = curve(0.77, 0, 0.18, 1);
export const cubic = curve(0.65, 0.05, 0.36, 1);
export const sine = curve(0.45, 0.05, 0.55, 0.95);
