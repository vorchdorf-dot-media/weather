import dynamic from 'next/dynamic';
import { useState } from 'preact/hooks';
import { useText, Text } from 'preact-i18n';
import { useQuery } from '@urql/preact';
import type { ChangeEvent } from 'react';
import { nanoid } from 'nanoid';

import SearchIcon from 'assets/icons/search.svg';
import useDebounce from 'utils/hooks/useDebounce';
import { GET_STATIONS } from 'utils/queries';

import styles from 'components/StationForm/StationForm.module.css';
import Link from 'next/link';

const StationForm = (): JSX.Element => {
  const [term, setTerm] = useState(null);
  const [id] = useState(nanoid);
  const [showBackdrop, setShowBackdrop] = useState(false);
  const { label, placeholder, searchSubmit } = useText({
    label: 'stations.search.label',
    placeholder: 'stations.search.placeholder',
    searchSubmit: 'stations.search.submit',
  });

  const [{ data, fetching, error }] = useQuery({
    query: GET_STATIONS,
    variables: { name: term },
    pause: !term,
  });

  const ArrowUpRight = dynamic(() => import('assets/icons/arrow-up-right.svg'));

  const handleChange = useDebounce<ChangeEvent<HTMLInputElement>>(
    (event: ChangeEvent<HTMLInputElement>) => setTerm(event?.target?.value),
    750
  );

  const handleBlur = (event): void => {
    event.preventDefault();
    setShowBackdrop(false);
    document.body.style.position = '';
    document.body.style.top = '';
  };

  const handleFocus = (event): void => {
    event.preventDefault();
    setShowBackdrop(true);
    document.body.style.position = 'fixed';
    document.body.style.top = `-${window.scrollY}px`;
  };

  const handleSubmit = (event): void => {
    event.preventDefault();
  };

  return (
    <>
      {showBackdrop && <div className={styles.backdrop} />}
      <form
        className={styles.form}
        action="#"
        method="POST"
        onSubmit={handleSubmit}
      >
        <div className={styles.container}>
          <label htmlFor={id}>{label}</label>
          <input
            autoFocus
            id={id}
            type="text"
            name="search"
            placeholder={placeholder}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
          />
          <button title={searchSubmit}>
            <SearchIcon role="img" aria-hidden="true" />
          </button>
          {data && (
            <section className={styles.results}>
              <span role="heading" aria-level={2}>
                <Text
                  id="stations.search.results"
                  fields={{ amount: data?.stations?.length, term }}
                />
              </span>
              {data?.stations?.length && (
                <ul>
                  {data.stations.map(({ id, name }) => (
                    <li>
                      <Link href={'/stations/' + id}>
                        <a title={name}>
                          <span>{name}</span>
                          <ArrowUpRight aria-hidden="true" />
                        </a>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
        </div>
      </form>
    </>
  );
};

export default StationForm;
