import { assertEquals } from "@std/assert";
import { processPuzzle1, processPuzzle2 } from "./main.ts";

Deno.test("processPuzzle1", async () => {
  // const test1 = ReadableStream.from([
  //   "3   4",
  //   "4   3",
  //   "2   5",
  //   "1   3",
  //   "3   9",
  //   "3   3",
  // ]);
  assertEquals(
    await processPuzzle1(`${import.meta.dirname}/input.test.txt`),
    11,
  );
});

Deno.test("processPuzzle2", async () => {
  // const test1 = ReadableStream.from([
  //   "3   4",
  //   "4   3",
  //   "2   5",
  //   "1   3",
  //   "3   9",
  //   "3   3",
  // ]);
  assertEquals(
    await processPuzzle2(`${import.meta.dirname}/input.test.txt`),
    31,
  );
});
