import { useState } from 'preact/hooks';
import { useText } from 'preact-i18n';
import { nanoid } from 'nanoid';

import SearchIcon from 'assets/icons/search.svg';

import styles from 'components/StationForm/StationForm.module.css';

const StationForm = (): JSX.Element => {
  const [id] = useState(nanoid);
  const { label, placeholder, searchSubmit } = useText({
    label: 'stations.search.label',
    placeholder: 'stations.search.placeholder',
    searchSubmit: 'stations.search.submit',
  });

  const handleSubmit = (event): void => {
    event.preventDefault();
  };

  return (
    <form
      className={styles.form}
      action="#"
      method="POST"
      onSubmit={handleSubmit}
    >
      <div className={styles.container}>
        <label htmlFor={id}>{label}</label>
        <input autoFocus id={id} type="text" placeholder={placeholder} />
        <button title={searchSubmit}>
          <SearchIcon role="img" aria-hidden="true" />
        </button>
      </div>
    </form>
  );
};

export default StationForm;
