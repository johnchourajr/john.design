export const isEven = (num: number): boolean => num % 2 === 0;

export const even = isEven;

export const isOdd = (num: number): boolean => !isEven(num);

export const odd = isOdd;
