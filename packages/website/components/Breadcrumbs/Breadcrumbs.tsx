import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo } from 'preact/hooks';

import styles from 'components/Breadcrumbs/Breadcrumbs.module.css';
import dynamic from 'next/dynamic';

const Breadcrumbs = (): JSX.Element => {
  const { asPath } = useRouter();
  const segments = useMemo(
    () =>
      asPath &&
      asPath
        .split('/')
        .filter(segment => !!segment)
        .reduce(
          (breadcrumbs, current) => {
            const prev = breadcrumbs[breadcrumbs.length - 1];
            return breadcrumbs.concat([
              {
                url:
                  prev.url === '/'
                    ? prev.url + current
                    : `${prev.url}/${current}`,
                label: current,
              },
            ]);
          },
          [{ url: '/', label: '/' }]
        ),
    [asPath]
  );

  const HomeIcon = dynamic(() => import('assets/icons/home.svg'));

  return (
    segments.length > 1 && (
      <nav aria-label="Breadcrumb">
        <ul className={styles.list}>
          {segments.map(({ url, label }, i) => (
            <li key={url}>
              {i < segments.length - 1 ? (
                <>
                  <Link href={url}>
                    <a title={url === '/' ? 'Homepage' : label}>
                      {url === '/' ? <HomeIcon aria-hidden="true" /> : label}
                    </a>
                  </Link>
                  <svg
                    className={styles.separator}
                    role="img"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="0.25"
                    viewBox="0 0 2 2"
                  >
                    <path d="M0.5,0 L1.5,1 L0.5,2" />
                  </svg>
                </>
              ) : (
                <span aria-current="page">{label}</span>
              )}
            </li>
          ))}
        </ul>
      </nav>
    )
  );
};

export default Breadcrumbs;
