import { useText } from 'preact-i18n';

import ErrorCard from 'components/Card/ErrorCard';

const ErrorPage = ({ stack, statusCode, title }): JSX.Element => {
  const { notFound } = useText('error.notFound');
  return (
    <>
      <h1>{statusCode}</h1>
      <ErrorCard message={title || notFound} stack={stack} />
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
