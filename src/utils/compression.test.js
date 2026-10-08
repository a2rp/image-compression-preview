import assert from "node:assert/strict";
import test from "node:test";
import { getCompressedFilename, getImageStats, getQualityLabel, getSizeMessage, maxImageBytes, maxImagePixels, validateImageDimensions, validateSourceImage } from "./compression.js";

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

test("formats size feedback safely before and after compression", () => {
  assert.equal(getSizeMessage(null), "");
  assert.equal(getSizeMessage(getImageStats(1000, 600)), "40.0% smaller");
  assert.equal(getSizeMessage(getImageStats(400, 500)), "25.0% larger");
  assert.equal(getSizeMessage(getImageStats(500, 500)), "Same size as original");
});

test("accepts useful image dimensions and rejects unsafe canvases", () => {
  assert.deepEqual(validateImageDimensions(4000, 4000), { width: 4000, height: 4000 });
  assert.equal(maxImagePixels, 25_000_000);
  assert.throws(() => validateImageDimensions(8193, 100), /8,192 pixels per side/);
  assert.throws(() => validateImageDimensions(5001, 5000), /25 megapixels/);
  assert.throws(() => validateImageDimensions(0, 100), /positive whole numbers/);
});

test("labels quality bands and creates an output filename for each format", () => {
  assert.equal(getQualityLabel(0.9), "Higher detail");
  assert.equal(getQualityLabel(0.75), "Balanced");
  assert.equal(getQualityLabel(0.5), "Smaller file");
  assert.equal(getCompressedFilename("team.photo.png", "image/webp"), "team.photo-compressed.webp");
  assert.equal(getCompressedFilename("photo.jpg", "image/jpeg"), "photo-compressed.jpg");
});
