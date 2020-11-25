import { Provider } from '@urql/preact';
import { GetServerSideProps } from 'next';
import { translate } from 'preact-i18n';

import TemperatureCard from 'components/Card/TemperatureCard';
import client from 'utils/graphql';
import { GET_LATEST_ENTRY } from 'utils/queries';

const Station = ({ entry }): JSX.Element => {
  return (
    <Provider value={client}>
      <h1>{entry?.station?.name}</h1>
      <div>Hello World</div>
      <TemperatureCard link={false} variant="primary" entry={entry} />
    </Provider>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  params: { station },
  locale,
}) => {
  try {
    const dictionary = (await import(`locales/${locale}.json`)).default;
    const { data, error } = await client
      .query(GET_LATEST_ENTRY, { station })
      .toPromise();
    if (error) {
      throw new Error(error.message);
    }
    return {
      props: {
        entry: data?.entry,
        title: translate('stations.title', '', dictionary, {
          station: data?.entry?.station?.name,
        }),
      },
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
};

export default Station;
