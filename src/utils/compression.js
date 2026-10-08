export const maxImageBytes = 20 * 1024 * 1024;
export const maxImageDimension = 8192;
export const maxImagePixels = 25_000_000;
export const outputFormats = ["image/webp", "image/jpeg"];

const supportedExtensions = new Set(["jpg", "jpeg", "png", "webp"]);
const supportedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export const validateSourceImage = (file) => {
  const extension = String(file.name ?? "").split(".").pop().toLowerCase();
  const hasSupportedType = supportedMimeTypes.has(String(file.type ?? "").toLowerCase())
    || (!file.type && supportedExtensions.has(extension));
  if (!hasSupportedType) throw new Error("Choose a JPEG, PNG, or WebP image.");
  if (!Number.isFinite(file.size) || file.size <= 0) throw new Error("This image is empty or unreadable.");
  if (file.size > maxImageBytes) throw new Error("Images are limited to 20 MB.");
  return file;
};

export const validateImageDimensions = (width, height) => {
  if (![width, height].every((value) => Number.isSafeInteger(value) && value > 0)) {
    throw new Error("Image dimensions must be positive whole numbers.");
  }
  if (width > maxImageDimension || height > maxImageDimension || width * height > maxImagePixels) {
    throw new Error("This image is too large to process safely. Choose an image up to 8,192 pixels per side and 25 megapixels.");
  }
  return { width, height };
};

export const getImageStats = (originalBytes, compressedBytes) => {
  if (![originalBytes, compressedBytes].every((value) => Number.isFinite(value) && value >= 0)) {
    throw new Error("Image sizes must be non-negative numbers.");
  }
  const savedBytes = originalBytes - compressedBytes;
  return {
    originalBytes,
    compressedBytes,
    savedBytes,
    reductionPercent: originalBytes ? (savedBytes / originalBytes) * 100 : 0,
    isSmaller: savedBytes >= 0,
  };
};

export const getSizeMessage = (stats) => {
  if (!stats) return "";
  if (stats.savedBytes === 0) return "Same size as original";
  if (stats.isSmaller) return `${stats.reductionPercent.toFixed(1)}% smaller`;
  return `${Math.abs(stats.reductionPercent).toFixed(1)}% larger`;
};

export const getQualityLabel = (quality) => {
  if (quality >= 0.85) return "Higher detail";
  if (quality >= 0.65) return "Balanced";
  return "Smaller file";
};

export const getCompressedFilename = (filename, mimeType) => {
  const basename = String(filename ?? "image").replace(/\.[^.]+$/, "") || "image";
  const extension = mimeType === "image/jpeg" ? "jpg" : "webp";
  return `${basename}-compressed.${extension}`;
};
