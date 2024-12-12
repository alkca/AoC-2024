import { TextLineStream } from "@std/streams";

/**
 * Calculate the the equation from an array of numbers where we add the
 * multiple of the even and odd indicies of the array
 */
function calculationEquation(equation: number[]): number {
  let total = 0;

  for (let i = 0; i < equation.length; i += 2) {
    total += equation[i] * equation[i + 1];
  }

  return total;
}

/**
 * Takes a segment of a line and calculates an answer
 *
 * @param lines Input line equation segment
 * @returns equation answer
 */
function calculateEquationSegment(segment: string): number {
  const regex = /mul\((\d{1,3}),(\d{1,3})\)/g;
  let match: RegExpExecArray | null;
  const equationList: number[] = [];

  while ((match = regex.exec(segment)) !== null) {
    const equation: number[] = match.slice(1, 3).map(Number) || [];
    equationList.push(...equation);
  }

  return calculationEquation(equationList);
}

async function calculationEquationLines(
  lines: ReadableStream,
): Promise<number> {
  let total = 0;

  for await (const line of lines) {
    total += calculateEquationSegment(line);
  }

  return total;
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
    answer = await calculationEquationLines(lines);

    console.log(
      `The answer to the equation on puzzle 1:  ${answer}`,
    );
  } catch (error) {
    console.error(`Error reading input for puzzle: ${error}`);
  } finally {
    file?.close();
  }

  return answer;
}

/**
 * Process the multiplication input but adds two new instructions:
 * two new instructions you'll need to handle:
 *  - The do() instruction enables future mul instructions.
 *  - The don't() instruction disables future mul instructions.
 *
 * @param lines Input file lines from puzzle
 * @returns answer
 */

async function calculationEquationLinesWithNOP(
  lines: ReadableStream,
): Promise<number> {
  let total = 0;
  let includeCalc = true;

  for await (const line of lines) {
    const lineSegments: string[] = line.split(/(don't\(\)|do\(\))/);
    for (const lineSegment of lineSegments) {
      if (lineSegment === "don't()") {
        includeCalc = false;
      } else if (lineSegment === "do()") {
        includeCalc = true;
      } else if (includeCalc) {
        total += calculateEquationSegment(lineSegment);
      }
    }
  }

  return total;
}

/**
 * Processes the input puzzle file and calculates the solution #2.
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
    answer = await calculationEquationLinesWithNOP(lines);

    console.log(
      `The answer to the equation on puzzle 2:  ${answer}`,
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
