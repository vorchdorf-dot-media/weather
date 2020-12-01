import { GetServerSideProps } from 'next';
import { translate, useText } from 'preact-i18n';

const Index = ({ title }) => {
  const { headline } = useText({
    headline: 'index.headline',
  });
  return (
    <>
      <h1>{title}</h1>
      <span>{headline}</span>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const translation = (await import(`locales/${locale}.json`)).default;
  return {
    props: {
      title: translate('index.title', '', translation),
    },
  };
};

export default Index;
