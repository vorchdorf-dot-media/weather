import classnames from 'classnames';

import styles from 'components/Container/Container.module.css';

const Container = ({
  children,
  className,
}: {
  children: JSX.Element | JSX.Element[];
  className?: string;
}): JSX.Element => {
  return (
    <div className={classnames(styles.container, className)}>{children}</div>
  );
};

export default Container;
