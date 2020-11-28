import styles from 'components/Card/Card.module.css';
import type { ReactElement } from 'react';
import classnames from 'classnames';

export interface CardProps {
  children: ReactElement | ReactElement[];
  variant: 'grey' | 'primary' | 'secondary';
  className?: string;
}

const Card = ({ children, className, variant }: CardProps): JSX.Element => (
  <section className={classnames(styles.card, styles[variant], className)}>
    {children}
  </section>
);

export default Card;
