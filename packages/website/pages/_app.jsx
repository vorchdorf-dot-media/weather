import { Provider } from '@urql/preact';
import { useEffect, useState } from 'preact/hooks';
import { IntlProvider } from 'preact-i18n';
import Head from 'next/head';

import Footer from 'components/Footer';
import SEOBlock from 'components/SEO';
import client from 'utils/graphql';

import 'assets/styles/global.css';
import 'assets/styles/_app.css';

const App = ({ Component, pageProps, router }) => {
  const { asPath, locale } = router;
  const [definition, setDefinition] = useState({});

  useEffect(() => {
    locale &&
      import(`locales/${locale}.json`).then(loc => setDefinition(loc.default));
  }, [locale]);

  return (
    <IntlProvider definition={definition}>
      <Head>
        <title>{pageProps.title}</title>
        <SEOBlock path={asPath} name={pageProps.title} />
      </Head>
      <main>
        <Provider value={client}>
          <Component {...pageProps} />
        </Provider>
      </main>
      <Footer />
    </IntlProvider>
  );
};

export default App;
