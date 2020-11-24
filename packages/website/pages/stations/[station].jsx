import { translate } from 'preact-i18n';

import LoadingCard from 'components/Card/LoadingCard';
import client from 'utils/graphql';
import { GET_LATEST_ENTRY } from 'utils/queries';

const Station = ({ entry: { station }, title }) => {
  return (
    <>
      <h1>{station?.name}</h1>
      <div>Hello World</div>
      <LoadingCard variant="grey" />
    </>
  );
};

export const getServerSideProps = async ({ params: { station }, locale }) => {
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
