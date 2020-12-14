import type {
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import { translate } from 'preact-i18n';

import StationForm from 'components/StationForm';

const Stations = ({ title }): JSX.Element => {
  return (
    <>
      <h1>{title}</h1>
      <StationForm autoFocus />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({
  locale,
}: GetStaticPropsContext): Promise<
  GetStaticPropsResult<{ [key: string]: string }>
> => {
  return {
    props: {
      title: 'Heyo',
    },
    revalidate: 5,
  };
};

export default Stations;
