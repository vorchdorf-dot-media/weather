import Link from 'next/link';
import { useText } from 'preact-i18n';

import ErrorCard from 'components/Card/ErrorCard';
import Divider from 'components/Divider/Divider';
import StationForm from 'components/StationForm';

import styles from 'assets/styles/_error.module.css';

const ErrorPage = ({ stack, statusCode, title }): JSX.Element => {
  const { notFound } = useText('error.notFound');
  return (
    <>
      <h1 className={styles.heading}>{statusCode}</h1>
      <ErrorCard message={title || notFound} stack={stack} />
      <section className={styles.container}>
        <StationForm />
        <Divider
          level={2}
          aria-label="Station suchen oder zurück zur Startseite"
        >
          oder
        </Divider>
        <Link href="/">
          <a>&larr; Zurück zur Startseite</a>
        </Link>
      </section>
    </>
  );
};

ErrorPage.getInitialProps = ({ res, err }) => {
  return {
    stack: err?.stack,
    statusCode: res?.statusCode || err?.statusCode || 404,
    title: err?.title,
  };
};

export default ErrorPage;
