import styles from 'components/Divider/Divider.module.css';

export interface DividerProps {
  ['aria-label']?: string;
  children: string;
  level: number;
}

const Divider = ({
  ['aria-label']: ariaLabel,
  children,
  level,
}: DividerProps): JSX.Element => {
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
