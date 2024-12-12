import { TextLineStream } from "@std/streams";

/**
 * @param letterGrid 2D grid of characters
 * @param direction direction to check word in row/col increments
 * @param word word to check in the direction
 * @param row row in grid
 * @param col column in grid
 * @returns whether the word exists
 */
function isWordInDirection(
  letterGrid: string[][],
  direction: number[],
  word: string,
  row: number,
  col: number,
): boolean {
  let x = col;
  let y = row;

  for (const letter of word) {
    // False if we are out of bounds of the grid
    if (y < 0 || y >= letterGrid.length || x < 0 || x >= letterGrid[y].length) {
      return false;
    }

    if (letter !== letterGrid[y][x]) {
      return false;
    }
    y += direction[0];
    x += direction[1];
  }
  return true;
}

/**
 * Calculate the number of XMAS from the grid at row and col
 */
function processLetterInGrid(
  letterGrid: string[][],
  row: number,
  col: number,
): number {
  let total = 0;

  const directionToCheck: number[][] = [
    [-1, 0], // 0 degrees
    [-1, 1], // 45 degrees
    [0, 1], // 90 degrees
    [1, 1], // 135 degrees
    [1, 0], // 180 degrees
    [1, -1], // 225 degrees
    [0, -1], // 270 degrees
    [-1, -1], // 315 degrees
  ];

  const wordToCheck = "XMAS";

  for (const direction of directionToCheck) {
    if (isWordInDirection(letterGrid, direction, wordToCheck, row, col)) {
      total++;
    }
  }

  return total;
}

/**
 * Takes a grid and process each character one at a time looking for XMAS
 *
 * @param letterGrid A 2D grid of letters
 * @returns count of XMAS in the grid
 */
function processGridForXmas(letterGrid: string[][]): number {
  let total = 0;

  for (let row = 0; row < letterGrid.length; row++) {
    for (let col = 0; col < letterGrid[row].length; col++) {
      total += processLetterInGrid(letterGrid, row, col);
    }
  }

  return total;
}

async function calcXmasCount(
  lines: ReadableStream,
): Promise<number> {
  const letterGrid: string[][] = [];

  for await (const line of lines) {
    letterGrid.push(line.split(""));
  }

  return processGridForXmas(letterGrid);
}

/**
 * Processes the input puzzle file and calculates the solution #1.
 *
 * @param fileName input name of puzzle file including path
 * @returns solution to puzzle
 */
export async function processPuzzle1(fileName: string): Promise<number> {
  let file: Deno.FsFile | undefined;
  let answer = 0;

  try {
    const file = await Deno.open(fileName, { read: true });

    const lines = file
      .readable
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(new TextLineStream());
    answer = await calcXmasCount(lines);

    console.log(
      `The answer to puzzle 1:  ${answer}`,
    );
  } catch (error) {
    console.error(`Error reading input for puzzle: ${error}`);
  } finally {
    file?.close();
  }

  return answer;
}

/**
 * Calculate whether MAS in a cross backwards or forwards exists at the grid at row and col centred on "A"
 */
function isXmasCrossAtLetter(
  letterGrid: string[][],
  row: number,
  col: number,
): boolean {
  if (
    row < 1 || row >= letterGrid.length - 1 ||
    col < 1 || col >= letterGrid[row].length - 1
  ) {
    return false;
  }

  const wordDirections: string[] = [
    letterGrid[row - 1][col - 1] + letterGrid[row][col] +
    letterGrid[row + 1][col + 1],
    letterGrid[row - 1][col + 1] + letterGrid[row][col] +
    letterGrid[row + 1][col - 1],
  ];

  for (const word of wordDirections) {
    if (word !== "MAS" && word !== "SAM") {
      return false;
    }
  }

  return true;
}

/**
 * Takes a grid and process each character one at a time looking for XMAS
 *
 * @param letterGrid A 2D grid of letters
 * @returns count of XMAS in the grid
 */
function processGridForXmasCross(letterGrid: string[][]): number {
  let total = 0;

  for (let row = 0; row < letterGrid.length; row++) {
    for (let col = 0; col < letterGrid[row].length; col++) {
      if (isXmasCrossAtLetter(letterGrid, row, col)) {
        total++;
      }
    }
  }

  return total;
}

async function calcXmasCrossCount(
  lines: ReadableStream,
): Promise<number> {
  const letterGrid: string[][] = [];

  for await (const line of lines) {
    letterGrid.push(line.split(""));
  }

  return processGridForXmasCross(letterGrid);
}

/**
 * Processes the input puzzle file and calculates the solution #1.
 *
 * @param fileName input name of puzzle file including path
 * @returns solution to puzzle
 */
export async function processPuzzle2(fileName: string): Promise<number> {
  let file: Deno.FsFile | undefined;
  let answer = 0;

  try {
    const file = await Deno.open(fileName, { read: true });

    const lines = file
      .readable
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(new TextLineStream());
    answer = await calcXmasCrossCount(lines);

    console.log(
      `The answer to puzzle 2:  ${answer}`,
    );
  } catch (error) {
    console.error(`Error reading input for puzzle: ${error}`);
  } finally {
    file?.close();
  }

  return answer;
}

if (import.meta.main) {
  const INPUT_PUZZLE_FILE: string = `${import.meta.dirname}/input.txt`;
  await processPuzzle1(INPUT_PUZZLE_FILE);
  await processPuzzle2(INPUT_PUZZLE_FILE);
}
