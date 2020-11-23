import React from 'react';
import type { AppProps } from 'next/app';

import Footer from 'components/Footer';

import 'assets/styles/global.css';
import 'assets/styles/_app.css';

const App = ({ Component, pageProps }: AppProps): JSX.Element => (
  <>
    <main>
      <Component {...pageProps} />
    </main>
    <Footer />
  </>
);

export default App;
