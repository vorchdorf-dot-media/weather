import dynamic from 'next/dynamic';
import { useState } from 'preact/hooks';
import { useText } from 'preact-i18n';
import type { ChangeEvent } from 'react';
import { nanoid } from 'nanoid';

import SearchIcon from 'assets/icons/search.svg';
import Backdrop from 'components/Backdrop/Backdrop';
import useDebounce from 'utils/hooks/useDebounce';

import styles from 'components/StationForm/StationForm.module.css';

const StationForm = ({ autoFocus }: { autoFocus?: boolean }): JSX.Element => {
  const [term, setTerm] = useState(null);
  const [id] = useState(nanoid);
  const [showBackdrop, setShowBackdrop] = useState(false);
  const { label, placeholder, searchSubmit } = useText({
    label: 'stations.search.label',
    placeholder: 'stations.search.placeholder',
    searchSubmit: 'stations.search.submit',
  });

  const StationFormResults = dynamic(
    () => import('components/StationForm/StationFormResults')
  );

  const handleChange = useDebounce<ChangeEvent<HTMLInputElement>>(
    (event: ChangeEvent<HTMLInputElement>) => setTerm(event?.target?.value),
    750
  );

  const handleFocus = (): void => setShowBackdrop(true);

  const handleKeyUp = (event): void => {
    !showBackdrop && setShowBackdrop(true);
    event.keyCode === 27 && setShowBackdrop(false);
  };

  const handleSubmit = (event): void => {
    event.preventDefault();
  };

  return (
    <>
      {showBackdrop && <Backdrop onClose={() => setShowBackdrop(false)} />}
      <form
        className={styles.form}
        action="#"
        method="POST"
        onSubmit={handleSubmit}
      >
        <div className={styles.container}>
          <label htmlFor={id}>{label}</label>
          <input
            autoFocus={!!autoFocus}
            id={id}
            type="text"
            name="search"
            placeholder={placeholder}
            onChange={handleChange}
            onFocus={handleFocus}
            onKeyUp={handleKeyUp}
          />
          <button title={searchSubmit}>
            <SearchIcon role="img" aria-hidden="true" />
          </button>
          {showBackdrop && term && <StationFormResults term={term} />}
        </div>
      </form>
    </>
  );
};

export default StationForm;
