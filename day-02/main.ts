import { TextLineStream } from "@std/streams";

/**
 * Validate if the level difference is safe
 */
function isLevelDifferenceSafe(
  currentLevel: number,
  priorLevel: number,
): boolean {
  const floorDiff = Math.abs(currentLevel - priorLevel);
  return floorDiff >= 1 && floorDiff <= 3;
}

/**
 * Validate if the level is safe
 */
function isSafeLevel(levels: number[]): boolean {
  if (levels.length < 2) return true;

  let isIncreasing = null; // null: unknown

  for (let i = 1; i < levels.length; i++) {
    const [prev, curr] = [levels[i - 1], levels[i]];

    if (!isLevelDifferenceSafe(curr, prev)) {
      return false;
    }

    if (isIncreasing === null) {
      isIncreasing = curr > prev; // Set the trend
    } else if (
      (isIncreasing && curr <= prev) || (!isIncreasing && curr >= prev)
    ) {
      return false; // Invalid if trend is violated
    }
  }

  return true;
}

/**
 * Validate if the levels are safe by removing a level from the array
 */
function isSafeLevelWithTolerance(levels: number[]): boolean {
  for (let i = 0; i < levels.length; i++) {
    const levelsTolerance = [...levels];
    levelsTolerance.splice(i, 1);
    if (isSafeLevel(levelsTolerance)) {
      return true;
    }
  }

  return false;
}

/**
 * Calculate the total number of safe levels based on each level representing one line
 */
async function countSafeLevels(
  lines: ReadableStream,
): Promise<number> {
  let safeCount: number = 0;

  for await (const line of lines) {
    const levels: number[] = line.split(/\s+/).map(Number);
    if (isSafeLevel(levels)) {
      safeCount++;
    }
  }

  return safeCount;
}

/**
 * Processes the input puzzle file and calculates the solution #1.
 *
 * @param fileName input name of puzzle file including path
 * @returns solution to puzzle
 */
export async function processPuzzle1(fileName: string): Promise<number> {
  let file: Deno.FsFile | undefined;
  let safeCount: number = 0;

  try {
    const file = await Deno.open(fileName, { read: true });

    const lines = file
      .readable
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(new TextLineStream());
    safeCount = await countSafeLevels(lines);

    console.log(
      `The total safe levels are:  ${safeCount}`,
    );
  } catch (error) {
    console.error(`Error reading input for puzzle: ${error}`);
  } finally {
    file?.close();
  }

  return safeCount;
}

/**
 * Calculate the total number of safe levels based on each level representing one line
 */
async function countSafeLevelsWithToleration(
  lines: ReadableStream,
): Promise<number> {
  let safeCount: number = 0;

  for await (const line of lines) {
    const levels: number[] = line.split(/\s+/).map(Number);
    if (isSafeLevel(levels)) {
      safeCount++;
    } else if (isSafeLevelWithTolerance(levels)) {
      safeCount++;
    }
  }

  return safeCount;
}

/**
 * Processes the input puzzle file and calculates the solution #2.
 *
 * @param fileName input name of puzzle file including path
 * @returns solution to puzzle
 */
export async function processPuzzle2(fileName: string): Promise<number> {
  let file: Deno.FsFile | undefined;
  let safeCount: number = 0;

  try {
    const file = await Deno.open(fileName, { read: true });

    const lines = file
      .readable
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(new TextLineStream());
    safeCount = await countSafeLevelsWithToleration(lines);

    console.log(
      `The total safe levels are:  ${safeCount}`,
    );
  } catch (error) {
    console.error(`Error reading input for puzzle: ${error}`);
  } finally {
    file?.close();
  }

  return safeCount;
}

if (import.meta.main) {
  const INPUT_PUZZLE_FILE: string = `${import.meta.dirname}/input.txt`;
  await processPuzzle1(INPUT_PUZZLE_FILE);
  await processPuzzle2(INPUT_PUZZLE_FILE);
}
