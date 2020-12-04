import type { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import { translate, useText } from 'preact-i18n';

import StationForm from 'components/StationForm/StationForm';

import styles from 'assets/styles/index.module.css';

const Index = ({ title }) => {
  const { headline } = useText({
    headline: 'index.headline',
  });
  const ArduinoGraphic = dynamic(() => import('assets/graphics/arduino.svg'));
  return (
    <section className={styles.container}>
      <div>
        <h1>{title}</h1>
        <span>{headline}</span>
      </div>
      <StationForm />
      <figure>
        <ArduinoGraphic aria-label="Arduino Graphic" />
        <figcaption>Arduino Graphic</figcaption>
      </figure>
    </section>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const translation = (await import(`locales/${locale}.json`)).default;
  return {
    props: {
      title: translate('index.title', '', translation),
    },
  };
};

export default Index;
