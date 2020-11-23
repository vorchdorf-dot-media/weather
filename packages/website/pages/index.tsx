import { useRouter } from 'next/router';
import SeoBlock from 'components/SEO';

import Head from 'next/head';

const Index = (): JSX.Element => {
  const { asPath } = useRouter();
  return (
    <>
      <Head>
        <title>Index Page</title>
        <SeoBlock path={asPath} name="Index Page" />
      </Head>
      Hello world
    </>
  );
};

export default Index;
