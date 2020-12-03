import { useState } from 'preact/hooks';
import { useText } from 'preact-i18n';
import { nanoid } from 'nanoid';

import styles from 'components/StationForm/StationForm.module.css';

const StationForm = (): JSX.Element => {
  const [id] = useState(nanoid);
  const { searchFor } = useText({
    searchFor: 'stations.searchFor',
  });

  const handleSubmit = (event): void => {
    event.preventDefault();
  };

  return (
    <div className={styles.container}>
      <form action="#" method="POST" onSubmit={handleSubmit}>
        <label htmlFor={id}>{searchFor}</label>
        <input id={id} type="text" />
      </form>
    </div>
  );
};

export default StationForm;
