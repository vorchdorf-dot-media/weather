import Link from 'next/link';
import { useText } from 'preact-i18n';

import ErrorCard from 'components/Card/ErrorCard';
import Divider from 'components/Divider/Divider';
import StationForm from 'components/StationForm';

import styles from 'assets/styles/_error.module.css';

const ErrorPage = ({ stack, title }): JSX.Element => {
  const {
    backToHome,
    headline,
    notFound,
    or,
    searchOrBack,
    subtitle,
  } = useText({
    backToHome: 'error.backToHome',
    headline: 'error.headline',
    notFound: 'error.notFound',
    or: 'error.or',
    searchOrBack: 'error.searchOrBack',
    subtitle: 'error.subtitle',
  });
  return (
    <>
      <h1 className={styles.heading}>{headline}</h1>
      <p>{subtitle}</p>
      <div className={styles.container}>
        <section className={styles.actions}>
          <StationForm />
          <Divider level={2} aria-label={searchOrBack}>
            {or}
          </Divider>
          <Link href="/">
            <a>&larr; {backToHome}</a>
          </Link>
        </section>
        <ErrorCard message={title || notFound} stack={stack} />
      </div>
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
