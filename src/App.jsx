import { FiArrowDown, FiArrowUpRight, FiCheck, FiImage, FiLock, FiSliders } from "react-icons/fi";
import BackToTop from "./components/backToTop/index.jsx";
import CompressionStudio from "./components/compressionStudio/index.jsx";
import SiteFooter from "./components/siteFooter/index.jsx";
import SiteHeader from "./components/siteHeader/index.jsx";
import styles from "./App.module.css";

const App = () => (
  <div className={styles.page} id="top">
    <SiteHeader />
    <main>
      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={styles.heroCopy}>
          <p className={styles.kicker}><span /> A quieter way to make images lighter</p>
          <h1 id="hero-title">Smaller files.<br /><em>Same feeling.</em></h1>
          <p className={styles.intro}>Fine-tune an image until the file size feels right. Compare the original and compressed result side by side, then keep the version you love.</p>
          <div className={styles.heroActions}><a className={styles.primaryLink} href="#studio">Start compressing <FiArrowDown aria-hidden="true" /></a><span><FiLock aria-hidden="true" /> Your images stay on your device</span></div>
          <div className={styles.heroFacts}><span><b>01</b> Add a photo</span><i /><span><b>02</b> Find the balance</span><i /><span><b>03</b> Save it locally</span></div>
        </div>
        <div className={styles.heroArtwork} aria-label="Abstract comparison of an original photo and a lighter compressed copy" role="img">
          <div className={styles.artTopline}><span>COMPRESSION STUDY / 01</span><span><FiSliders aria-hidden="true" /> 78% QUALITY</span></div>
          <div className={styles.artPhoto}>
            <div className={styles.sun} /><div className={styles.hillBack} /><div className={styles.hillFront} />
            <span className={styles.photoLabel}>a little more room</span>
            <span className={styles.sizeBadge}><FiCheck aria-hidden="true" /> −42% file size</span>
          </div>
          <div className={styles.artCaption}><div><span>ORIGINAL</span><b>3.8 MB</b></div><div className={styles.captionRule} /><div><span>COMPRESSED</span><b>2.2 MB</b></div><a href="#studio" aria-label="Try image compression"><FiArrowUpRight aria-hidden="true" /></a></div>
          <div className={styles.artNote}><FiImage aria-hidden="true" /> A closer look, pixel by pixel.</div>
        </div>
        <a className={styles.scrollCue} href="#studio" aria-label="Scroll to image compression tool"><span>SCROLL TO EXPLORE</span><FiArrowDown aria-hidden="true" /></a>
      </section>
      <CompressionStudio />
      <section className={styles.guide} id="guide" aria-labelledby="guide-title">
        <div className={styles.guideIntro}><p className={styles.kicker}>GOOD TO KNOW</p><h2 id="guide-title">A little care for every pixel.</h2><p>Compression is a balance between how an image looks and how much space it takes. This workspace keeps that choice clear and in your hands.</p></div>
        <div className={styles.guideCards}>
          <article><span>01</span><h3>Choose your output</h3><p>WebP is compact and keeps transparency. JPEG works in more places and fills transparent areas with white.</p></article>
          <article><span>02</span><h3>Set the detail</h3><p>Move quality down for a lighter result, or up when the small details matter. The preview updates before you save.</p></article>
          <article><span>03</span><h3>Keep it private</h3><p>Encoding happens in your browser tab. The image is not sent to a server, and a download only starts when you choose it.</p></article>
        </div>
        <div className={styles.guideFoot}><span>MADE FOR SMALLER FILES, NOT SMALLER IDEAS</span><a href="#studio">Back to the workspace <FiArrowUpRight aria-hidden="true" /></a></div>
      </section>
    </main>
    <SiteFooter />
    <BackToTop />
  </div>
);

export default App;
