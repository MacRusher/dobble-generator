/**
 * Generate unique cards according to the Ray-Chaudhuri–Wilson theorem
 * @see https://math.stackexchange.com/questions/36798/what-is-the-math-behind-the-game-spot-it
 * @see https://math.stackexchange.com/questions/1303497/what-is-the-algorithm-to-generate-the-cards-in-the-game-dobble-known-as-spo
 */
export const generateCards = (n: number) => {
  const d = [...Array(n).keys()];

  return [
    [...d, n],
    ...d.flatMap(a => [
      [0, ...d.map(b => n + 1 + n * a + b)],
      ...d.map(b => [a + 1, ...d.map(c => n + 1 + n * c + ((a * c + b) % n))]),
    ]),
  ];
};
