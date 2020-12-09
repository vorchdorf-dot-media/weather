import type { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import { translate, useText } from 'preact-i18n';

import StationForm from 'components/StationForm/StationForm';

import styles from 'assets/styles/index.module.css';
import Divider from 'components/Divider';

const Index = ({ title }) => {
  const { graphic, headline, statistics } = useText({
    graphic: 'index.graphic.caption',
    headline: 'index.headline',
    statistics: 'index.statistics',
  });
  const ArduinoGraphic = dynamic(() => import('assets/graphics/arduino.svg'));
  return (
    <>
      <StationForm />
      <article className={styles.container}>
        <div>
          <h1>{title}</h1>
          <p>{headline}</p>
        </div>
        <figure>
          <ArduinoGraphic aria-label={graphic} />
          <figcaption>{graphic}</figcaption>
        </figure>
      </article>
      {/* <section>
        <Divider level={2}>{statistics}</Divider>
      </section> */}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const translation = (await import(`locales/${locale}.json`)).default;
  return {
    props: {
      description: translate('site.description', '', translation),
      title: translate('index.title', '', translation),
    },
  };
};

export default Index;
