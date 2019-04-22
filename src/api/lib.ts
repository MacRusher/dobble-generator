/**
 * Generate supported plains (dimensions) according to the Ray-Chaudhuri–Wilson theorem
 * n - prime number
 * @see https://math.stackexchange.com/questions/36798/what-is-the-math-behind-the-game-spot-it
 */
export const plains = [3, 5, 7].map(n => ({
  n,
  symbols: n ** 2 + n + 1,
  symbolsPerCard: n + 1,
}));

/**
 * Generate unique cards for available plains
 * @param n - prime number
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

/**
 * Promisify the FileReader::readAsDataURL method
 */
export const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
