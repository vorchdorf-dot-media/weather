import { useEffect, useState } from 'preact/hooks';
import { IntlProvider } from 'preact-i18n';
import { AppProps } from 'next/app';
import Head from 'next/head';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import Footer from 'components/Footer';
import SEOBlock from 'components/SEO';

import 'assets/styles/global.css';
import 'assets/styles/_app.css';

const App = ({ Component, pageProps, router }: AppProps): JSX.Element => {
  const { asPath, defaultLocale, locale } = router;
  const [definition, setDefinition] = useState({});
  const locales = new Set([defaultLocale]);

  dayjs.extend(relativeTime);

  useEffect(() => {
    if (locale) {
      import(`locales/${locale}.json`).then(loc => setDefinition(loc.default));
      if (!locales.has(locale)) {
        import('dayjs/locale/' + locale).then(({ default: loc }) =>
          dayjs.locale(loc)
        );
        locales.add(locale);
      } else {
        dayjs.locale(locale);
      }
    }
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
