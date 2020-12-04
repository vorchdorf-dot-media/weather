import { useText } from 'preact-i18n';

import ErrorCard from 'components/Card/ErrorCard';
import StationForm from 'components/StationForm';

import styles from 'assets/styles/_error.module.css';

const ErrorPage = ({ stack, statusCode, title }): JSX.Element => {
  const { notFound } = useText('error.notFound');
  return (
    <>
      <h1 className={styles.heading}>{statusCode}</h1>
      <ErrorCard message={title || notFound} stack={stack} />
      <StationForm />
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
