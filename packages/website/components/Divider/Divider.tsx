import classnames from 'classnames';

import styles from 'components/Divider/Divider.module.css';

export interface DividerProps {
  ['aria-label']?: string;
  children: string;
  className?: string;
  level: number;
}

const Divider = ({
  ['aria-label']: ariaLabel,
  children,
  className,
  level,
}: DividerProps): JSX.Element => {
  return (
    <div
      role="heading"
      aria-level={level}
      aria-label={ariaLabel}
      className={classnames(styles.container, className)}
    >
      <hr />
      <span>{children}</span>
      <hr />
    </div>
  );
};

export default Divider;
