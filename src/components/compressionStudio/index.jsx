import { useCallback, useEffect, useRef, useState } from "react";
import { FiDownload, FiImage, FiRefreshCw, FiShield, FiUploadCloud } from "react-icons/fi";
import { getCompressedFilename, getImageStats, getQualityLabel, outputFormats, validateImageDimensions, validateSourceImage } from "../../utils/compression.js";
import styles from "./styles.module.css";

const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)) - 1, units.length - 1);
  return `${(bytes / (1024 ** (index + 1))).toFixed(1)} ${units[index]}`;
};

const CompressionStudio = () => {
  const [source, setSource] = useState(null);
  const [sourceUrl, setSourceUrl] = useState("");
  const [dimensions, setDimensions] = useState(null);
  const [quality, setQuality] = useState(0.78);
  const [format, setFormat] = useState("image/webp");
  const [compressed, setCompressed] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const sourceUrlRef = useRef(null);
  const outputUrlRef = useRef(null);
  const requestRef = useRef(0);

  const processImage = useCallback(async (file, nextQuality, nextFormat) => {
    const requestId = ++requestRef.current;
    if (outputUrlRef.current) URL.revokeObjectURL(outputUrlRef.current);
    outputUrlRef.current = null;
    setCompressed(null);
    setProcessing(true);
    setError("");

    let bitmap;
    try {
      bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
      const { width, height } = bitmap;
      validateImageDimensions(width, height);
      if (requestId !== requestRef.current) return;
      setDimensions({ width, height });
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("This browser could not create an image canvas.");
      if (nextFormat === "image/jpeg") {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, width, height);
      }
      context.drawImage(bitmap, 0, 0, width, height);
      const blob = await new Promise((resolve, reject) => {
        canvas.toBlob((result) => {
          if (!result) reject(new Error("The browser could not compress this image."));
          else if (result.type !== nextFormat) reject(new Error(`${nextFormat === "image/webp" ? "WebP" : "JPEG"} export is unavailable in this browser.`));
          else resolve(result);
        }, nextFormat, nextQuality);
      });
      if (requestId !== requestRef.current) return;
      const url = URL.createObjectURL(blob);
      outputUrlRef.current = url;
      setCompressed({ blob, url, size: blob.size, width, height });
      setNotice("Preview ready. Adjust the settings or download the result.");
    } catch (compressionError) {
      if (requestId === requestRef.current) {
        setError(compressionError.message || "This image could not be processed.");
        setNotice("");
      }
    } finally {
      bitmap?.close?.();
      if (requestId === requestRef.current) setProcessing(false);
    }
  }, []);

  useEffect(() => () => {
    requestRef.current += 1;
    if (sourceUrlRef.current) URL.revokeObjectURL(sourceUrlRef.current);
    if (outputUrlRef.current) URL.revokeObjectURL(outputUrlRef.current);
  }, []);

  const chooseImage = (file) => {
    if (!file) return;
    try {
      validateSourceImage(file);
    } catch (fileError) {
      setError(fileError.message);
      setNotice("");
      return;
    }
    if (sourceUrlRef.current) URL.revokeObjectURL(sourceUrlRef.current);
    const url = URL.createObjectURL(file);
    sourceUrlRef.current = url;
    setSource(file);
    setSourceUrl(url);
    setDimensions(null);
    setError("");
    setNotice("");
    void processImage(file, quality, format);
  };

  const handleQualityChange = (event) => {
    const nextQuality = Number(event.target.value);
    setQuality(nextQuality);
    if (source) void processImage(source, nextQuality, format);
  };

  const handleFormatChange = (nextFormat) => {
    setFormat(nextFormat);
    if (source) void processImage(source, quality, nextFormat);
  };

  const stats = compressed && source ? getImageStats(source.size, compressed.size) : null;
  const sizeMessage = stats?.savedBytes === 0 ? "Same size as original" : stats?.isSmaller ? `${stats.reductionPercent.toFixed(1)}% smaller` : `${Math.abs(stats.reductionPercent).toFixed(1)}% larger`;
  const outputName = source ? getCompressedFilename(source.name, format) : "image-compressed.webp";

  return (
    <section className={styles.studio} id="studio" aria-labelledby="studio-title">
      <div className={styles.heading}><div><p>LOCAL IMAGE WORKSPACE</p><h2 id="studio-title">Tune the trade-off.</h2><span>Choose an image, adjust quality, and compare the actual output before downloading.</span></div><div className={styles.privacy}><FiShield aria-hidden="true" /> Runs in this tab</div></div>
      <div className={styles.layout}>
        <div className={styles.controls}>
          <div className={`${styles.picker} ${dragging ? styles.dragging : ""}`} onDragEnter={(event) => { event.preventDefault(); setDragging(true); }} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setDragging(false); }} onDrop={(event) => { event.preventDefault(); setDragging(false); chooseImage(event.dataTransfer.files?.[0]); }}>
            <input id="image-input" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => { chooseImage(event.target.files?.[0]); event.target.value = ""; }} />
            <label htmlFor="image-input"><span className={styles.pickerIcon}>{source ? <FiImage aria-hidden="true" /> : <FiUploadCloud aria-hidden="true" />}</span><b>{source ? "Choose another image" : dragging ? "Drop image to begin" : "Drop an image here"}</b><span>{source ? source.name : "or browse your device · JPEG, PNG, WebP"}</span></label>
            {source && dimensions && <p className={styles.dimensions}>{dimensions.width} × {dimensions.height} px · {formatBytes(source.size)}</p>}
          </div>
          <fieldset className={styles.formatChoices}>
            <legend>Output format</legend>
            <div>
              {outputFormats.map((item) => <button className={format === item ? styles.selected : ""} key={item} type="button" aria-pressed={format === item} onClick={() => handleFormatChange(item)} disabled={!source || processing}><b>{item === "image/webp" ? "WebP" : "JPEG"}</b><span>{item === "image/webp" ? "Smaller, supports transparency" : "Wide compatibility, white background"}</span></button>)}
            </div>
          </fieldset>
          <div className={styles.qualityControl}>
            <div className={styles.qualityHeading}><label htmlFor="quality-range">Image quality</label><strong>{Math.round(quality * 100)}%</strong></div>
            <input id="quality-range" type="range" min="0.4" max="0.95" step="0.05" value={quality} onChange={handleQualityChange} disabled={!source || processing} />
            <div className={styles.rangeLabels}><span>Smaller file</span><span>More detail</span></div>
            <p>{getQualityLabel(quality)} · Adjust to refresh the preview.</p>
          </div>
          {error && <p className={styles.error} role="alert">{error}</p>}
          {notice && <p className={styles.notice} role="status" aria-live="polite">{notice}</p>}
          <a className={`${styles.downloadButton} ${!compressed || processing ? styles.disabled : ""}`} href={compressed && !processing ? compressed.url : undefined} download={compressed && !processing ? outputName : undefined} aria-disabled={!compressed || processing} onClick={(event) => { if (!compressed || processing) event.preventDefault(); }}><FiDownload aria-hidden="true" /> Download compressed image</a>
          {processing && <p className={styles.processing}><FiRefreshCw aria-hidden="true" /> Updating preview...</p>}
          <p className={styles.limitNote}>Up to 20 MB <span /> 8,192 px per side <span /> 25 megapixels</p>
        </div>
        <div className={styles.previewColumn}>
          <div className={styles.previewHeading}><h3>Side-by-side preview</h3>{stats && <span>{sizeMessage}</span>}</div>
          <div className={styles.previewGrid}>
            <article className={styles.previewCard}><div><span>ORIGINAL</span><b>{source ? formatBytes(source.size) : "--"}</b></div>{sourceUrl ? <img src={sourceUrl} alt="Original image preview" /> : <div className={styles.emptyPreview}><FiImage aria-hidden="true" /><span>Select an image to preview it here.</span></div>}</article>
            <article className={styles.previewCard}><div><span>COMPRESSED</span><b>{compressed && !processing ? formatBytes(compressed.size) : "--"}</b></div>{compressed && !processing ? <img src={compressed.url} alt="Compressed image preview" /> : <div className={styles.emptyPreview}>{processing ? <FiRefreshCw aria-hidden="true" /> : <FiImage aria-hidden="true" />}<span>{processing ? "Building a new preview..." : "Your adjusted image will appear here."}</span></div>}</article>
          </div>
          {stats && !processing && <div className={styles.resultSummary}><span>{stats.isSmaller ? "SIZE REDUCTION" : "SIZE CHANGE"}</span><strong>{sizeMessage}</strong><p>{stats.savedBytes >= 0 ? `${formatBytes(stats.savedBytes)} less than the original.` : `${formatBytes(Math.abs(stats.savedBytes))} larger than the original.`}</p></div>}
          <p className={styles.previewNote}>Image previews are generated locally with the browser canvas. Transparent pixels become white when exporting JPEG.</p>
        </div>
      </div>
    </section>
  );
};

export default CompressionStudio;
