export const randomBetween = (min: number, max: number) =>
  Math.random() * (max - min) + min;

export const makeRandomRotate = () => randomBetween(-60, 60);
