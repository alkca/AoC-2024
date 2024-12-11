import { assertEquals } from "@std/assert";
import { processPuzzle1, processPuzzle2 } from "./main.ts";

Deno.test("processPuzzle1", async () => {
  assertEquals(
    await processPuzzle1(`${import.meta.dirname}/input.test.txt`),
    2,
  );
});

Deno.test("processPuzzle2", async () => {
  assertEquals(
    await processPuzzle2(`${import.meta.dirname}/input.test.txt`),
    4,
  );
});
