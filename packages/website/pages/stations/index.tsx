import type {
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import { translate } from 'preact-i18n';

import StationForm from 'components/StationForm';

import styles from 'assets/styles/stations.module.css';

const Stations = ({ description, title }): JSX.Element => {
  return (
    <>
      <h1 className={styles.headline}>{title}</h1>
      <p className={styles.description}>{description}</p>
      <StationForm autoFocus />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({
  locale,
}: GetStaticPropsContext): Promise<
  GetStaticPropsResult<{ [key: string]: string }>
> => {
  const dictionary = (await import(`locales/${locale}.json`)).default;
  return {
    props: {
      description: translate('stations.search.description', '', dictionary),
      title: translate('stations.search.title', '', dictionary),
    },
    revalidate: 5,
  };
};

export default Stations;
