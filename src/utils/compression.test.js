import assert from "node:assert/strict";
import test from "node:test";
import { getCompressedFilename, getImageStats, getQualityLabel, maxImageBytes, validateSourceImage } from "./compression.js";

test("accepts supported image types and caps source size", () => {
  assert.equal(validateSourceImage({ name: "photo.png", type: "image/png", size: 100 }).name, "photo.png");
  assert.equal(validateSourceImage({ name: "photo.webp", type: "", size: 100 }).name, "photo.webp");
  assert.throws(() => validateSourceImage({ name: "photo.gif", type: "image/gif", size: 100 }), /JPEG, PNG, or WebP/);
  assert.throws(() => validateSourceImage({ name: "empty.png", type: "image/png", size: 0 }), /empty/);
  assert.throws(() => validateSourceImage({ name: "large.png", type: "image/png", size: maxImageBytes + 1 }), /20 MB/);
});

test("calculates savings and handles a result that grows", () => {
  assert.deepEqual(getImageStats(1000, 600), { originalBytes: 1000, compressedBytes: 600, savedBytes: 400, reductionPercent: 40, isSmaller: true });
  assert.equal(getImageStats(400, 500).isSmaller, false);
  assert.equal(getImageStats(0, 0).reductionPercent, 0);
  assert.throws(() => getImageStats(-1, 2), /non-negative/);
});

test("labels quality bands and creates an output filename for each format", () => {
  assert.equal(getQualityLabel(0.9), "Higher detail");
  assert.equal(getQualityLabel(0.75), "Balanced");
  assert.equal(getQualityLabel(0.5), "Smaller file");
  assert.equal(getCompressedFilename("team.photo.png", "image/webp"), "team.photo-compressed.webp");
  assert.equal(getCompressedFilename("photo.jpg", "image/jpeg"), "photo-compressed.jpg");
});
