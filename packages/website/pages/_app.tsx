import { useEffect, useState } from 'preact/hooks';
import { IntlProvider } from 'preact-i18n';
import { AppProps } from 'next/app';
import Head from 'next/head';

import Footer from 'components/Footer';
import SEOBlock from 'components/SEO';

import 'assets/styles/global.css';
import 'assets/styles/_app.css';

const App = ({ Component, pageProps, router }: AppProps): JSX.Element => {
  const { asPath, locale } = router;
  const [definition, setDefinition] = useState({});
  const locales = new Set();

  useEffect(() => {
    locale &&
      !locales.has(locale) &&
      import(`locales/${locale}.json`).then(({ default: loc }) => {
        setDefinition(loc);
        locales.add(locale);
      });
  }, [locale]);

  return (
    <IntlProvider definition={definition}>
      <Head>
        <title>{pageProps.title}</title>
        <SEOBlock path={asPath} name={pageProps.title} />
      </Head>
      <main>
        <Component {...pageProps} />
      </main>
      <Footer />
    </IntlProvider>
  );
};

export default App;
