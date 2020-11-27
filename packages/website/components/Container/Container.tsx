import styles from 'components/Container/Container.module.css';

const Container = ({ children }): JSX.Element => {
  return <div className={styles.container}>{children}</div>;
};

export default Container;
