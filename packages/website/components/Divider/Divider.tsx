import styles from 'components/Divider/Divider.module.css';

const Divider = ({
  ['aria-label']: ariaLabel,
  children,
  level,
}): JSX.Element => {
  return (
    <div className={styles.container}>
      <hr />
      <span role="heading" aria-level={level} aria-label={ariaLabel}>
        {children}
      </span>
      <hr />
    </div>
  );
};

export default Divider;
