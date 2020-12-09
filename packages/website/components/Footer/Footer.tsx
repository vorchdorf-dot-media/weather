import Link from 'next/link';
import { Text } from 'preact-i18n';

import pkg from 'package.json';
import Container from 'components/Container';
import SocialList from 'components/Footer/Social';

import styles from 'components/Footer/Footer.module.css';

const CREATED = 2020;
const CURRENT = new Date().getFullYear();
const URL = process.env.DEPLOY_PRIME_URL || 'http://localhost:3000';

const Footer = (): JSX.Element => {
  const { repository, author } = pkg;
  return (
    <footer className={styles.footer}>
      <Container>
        <span role="heading" aria-level={2}>
          <Link href="/">
            <a>{URL}</a>
          </Link>
        </span>
        <p>
          <Text id="site.description" />{' '}
          <a href={repository} rel="noindex,nofollow">
            <Text id="site.visitRepository" /> &rarr;
          </a>
        </p>
      </Container>
      <SocialList />
      <span>
        <a
          href={author.url}
          rel="index,follow,noreferrer,noopener"
          target="_blank"
        >
          {author.name}
        </a>{' '}
        &copy; {CREATED}
        {CURRENT !== CREATED && '—' + CURRENT}
      </span>
    </footer>
  );
};

export default Footer;
