import { useEffect, useState } from 'preact/hooks';

import styles from 'components/Backdrop/Backdrop.module.css';

const Backdrop = ({ onClose }: { onClose: () => void }): JSX.Element => {
  const [scrollY] = useState(window.scrollY);

  const handleClose = event => event.key === 'Escape' && onClose();

  useEffect(() => {
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    if (document.body.scrollHeight > window.innerHeight) {
      document.body.style['padding-right'] = '15px';
      document.body.style['margin-right'] = '-15px';
    }

    window.addEventListener('keyup', handleClose.bind(this));

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      if (document.body.scrollHeight > window.innerHeight) {
        document.body.style['padding-right'] = '';
        document.body.style['margin-right'] = '';
      }

      window.removeEventListener('keyup', handleClose.bind(this));

      window.scrollTo({ top: scrollY });
    };
  }, []);

  return <div className={styles.backdrop} onClick={onClose} />;
};

export default Backdrop;
