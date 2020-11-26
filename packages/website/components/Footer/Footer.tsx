import SocialList from 'components/Footer/Social';

import styles from 'components/Footer/Footer.module.css';

const Footer = (): JSX.Element => {
  return (
    <footer className={styles.footer}>
      <SocialList />
    </footer>
  );
};

export default Footer;
