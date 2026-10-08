import { FiGithub, FiImage } from "react-icons/fi";
import styles from "./styles.module.css";

const SiteHeader = () => (
  <header className={styles.header}>
    <div className={styles.bar}>
      <a className={styles.brand} href="#top" aria-label="Image Compression Preview home">
        <span className={styles.brandMark}><FiImage aria-hidden="true" /></span>
        <span>Image <b>Optimize</b></span>
      </a>
      <nav className={styles.navigation} aria-label="Main navigation">
        <a href="#studio">Generator</a>
        <a href="#guide">How it works</a>
      </nav>
      <a className={styles.repository} href="https://github.com/a2rp/image-compression-preview" target="_blank" rel="noreferrer">
        <FiGithub aria-hidden="true" /> <span>Repository</span>
      </a>
    </div>
  </header>
);

export default SiteHeader;

