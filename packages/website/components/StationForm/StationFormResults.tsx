import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Text } from 'preact-i18n';
import { useQuery } from '@urql/preact';
import classnames from 'classnames';

import { GET_STATIONS } from 'utils/queries';

import styles from 'components/StationForm/StationFormResults.module.css';

const StationFormResults = ({ term }: { term: string }): JSX.Element => {
  const [{ data, fetching, error }] = useQuery({
    query: GET_STATIONS,
    variables: { name: term },
    pause: !term,
  });

  if (fetching) {
    return (
      <section className={classnames(styles.container, styles.loading)}>
        <span role="heading" aria-level={2}>
          <Text id="loading" />
        </span>
      </section>
    );
  }

  const ArrowUpRight = dynamic(() => import('assets/icons/arrow-up-right.svg'));

  return (
    data && (
      <section className={classnames(styles.container, styles.results)}>
        <span role="heading" aria-level={2}>
          <Text
            id="stations.search.results"
            fields={{ amount: data?.stations?.length, term }}
          />
        </span>
        {data?.stations?.length > 0 && (
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
    )
  );
};

export default StationFormResults;
