import { FiCodepen, FiCoffee, FiFacebook, FiGithub, FiGlobe, FiHeart, FiLinkedin, FiMail, FiYoutube } from "react-icons/fi";
import styles from "./styles.module.css";

const footerLinks = [
  { label: "Source code", href: "https://github.com/a2rp/image-compression-preview", icon: FiGithub },
  { label: "Portfolio", href: "https://www.ashishranjan.net", icon: FiGlobe },
  { label: "GitHub", href: "https://github.com/a2rp", icon: FiGithub },
  { label: "CodePen", href: "https://codepen.io/ash1198", icon: FiCodepen },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/aashishranjan", icon: FiLinkedin },
  { label: "Facebook", href: "https://www.facebook.com/theash.ashish/", icon: FiFacebook },
  { label: "YouTube", href: "https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1", icon: FiYoutube },
  { label: "Email", href: "mailto:ash.ranjan09@gmail.com", icon: FiMail },
  { label: "Support", href: "https://a2rp-donation-page.netlify.app/", icon: FiHeart },
  { label: "Buy Me a Coffee", href: "https://buymeacoffee.com/ashishranjan", icon: FiCoffee },
  { label: "Patreon", href: "https://www.patreon.com/ashishranjan", icon: FiHeart },
];

const SiteFooter = () => (
  <footer className={styles.footer}>
    <div className={styles.inner}>
      <div className={styles.credit}>
        <a className={styles.logoLink} href="https://www.ashishranjan.net" target="_blank" rel="noreferrer">
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Ashish Ranjan logo" />
        </a>
        <p>© {new Date().getFullYear()} <a href="https://github.com/a2rp" target="_blank" rel="noreferrer">Ashish Ranjan</a>. All rights reserved.</p>
      </div>
      <nav className={styles.links} aria-label="Project and social links">
        {footerLinks.map(({ label, href, icon: Icon }) => (
          <a key={label} href={href} target={href.startsWith("mailto:") ? undefined : "_blank"} rel={href.startsWith("mailto:") ? undefined : "noreferrer"}>
            <Icon aria-hidden="true" /> <span>{label}</span>
          </a>
        ))}
      </nav>
    </div>
  </footer>
);

export default SiteFooter;

