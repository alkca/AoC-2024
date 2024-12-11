import { TextLineStream } from "@std/streams";

/**
Calculate total distance within each pair, figure out how far apart the two numbers are;
you'll need to add up all of those distances
 */
export async function calculateTotalDistance(
  lines: ReadableStream,
): Promise<number> {
  const listNum1: number[] = [];
  const listNum2: number[] = [];
  let totalDistance: number = 0;

  for await (const line of lines) {
    const [num1, num2] = line.split(/\s+/).map(Number);
    listNum1.push(num1);
    listNum2.push(num2);
  }

  listNum1.sort();
  listNum2.sort();

  const listNum2Iterator = listNum2.values();

  for (const val1 of listNum1) {
    const val2 = listNum2Iterator.next().value || 0;
    //console.log(`${val1} / ${val2}`);
    totalDistance += Math.abs(val1 - val2);
  }

  return totalDistance;
}

export async function processPuzzle1(fileName: string): Promise<number> {
  let file: Deno.FsFile | undefined;
  let totalDistance: number = 0;

  try {
    const file = await Deno.open(fileName, { read: true });

    const lines = file
      .readable
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(new TextLineStream());
    totalDistance = await calculateTotalDistance(lines);

    console.log(
      `The total distance between the two lists is:  ${totalDistance}`,
    );
  } catch (error) {
    console.error(`Error reading input for puzzle: ${error}`);
  } finally {
    if (file) {
      file.close();
    }
  }

  return totalDistance;
}

/**
Calculate a total similarity score by adding up each number in the left list after
multiplying it by the number of times that number appears in the right list.
 */
export async function calculateSimilarityScore(
  lines: ReadableStream,
): Promise<number> {
  const listNum1: number[] = [];
  const mapNum2 = new Map<number, number>();
  let score: number = 0;

  for await (const line of lines) {
    const [num1, num2] = line.split(/\s+/).map(Number);
    listNum1.push(num1);
    mapNum2.set(num2, (mapNum2.get(num2) || 0) + 1);
  }

  for (const key of listNum1) {
    const num2 = mapNum2.get(key) || 0;
    // console.log(`key=${key},score=${score}+(${key}*${num2})`);
    score += key * num2;
  }

  return score;
}

export async function processPuzzle2(fileName: string): Promise<number> {
  let file: Deno.FsFile | undefined;
  let score: number = 0;

  try {
    const file = await Deno.open(fileName, { read: true });

    const lines = file
      .readable
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(new TextLineStream());
    score = await calculateSimilarityScore(lines);

    console.log(
      `The similarity score between the two lists is:  ${score}`,
    );
  } catch (error) {
    console.error(`Error reading input for puzzle: ${error}`);
  } finally {
    file?.close();
  }

  return score;
}

if (import.meta.main) {
  const INPUT_PUZZLE_FILE: string = `${import.meta.dirname}/input.txt`;
  await processPuzzle1(INPUT_PUZZLE_FILE);
  await processPuzzle2(INPUT_PUZZLE_FILE);
}
