import classnames from 'classnames';
import { nanoid } from 'nanoid';
import { useEffect, useState } from 'preact/hooks';
import { useText } from 'preact-i18n';

import styles from 'components/Footer/Lightswitch.module.css';

const Lightswitch = (): JSX.Element => {
  const [id] = useState(nanoid);
  const [light, setLight] = useState(false);
  const { lightswitch } = useText({
    lightswitch: 'footer.lightswitch.label',
  });

  useEffect(() => {
    const html = document.querySelector('html');
    const htmlTheme = html.classList.contains('theme-light')
      ? 'light'
      : html.classList.contains('theme-dark')
      ? 'dark'
      : null;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)')
      .matches
      ? 'light'
      : window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : null;
    const isLight =
      (localStorage.getItem('theme') || htmlTheme || mediaQuery) !== 'dark';

    setLight(isLight);
  }, []);

  useEffect(() => {
    const html = document.querySelector('html');
    /theme-[a-z]+/i.test(html.classList.toString())
      ? html.classList.replace(
          `theme-${light ? 'dark' : 'light'}`,
          `theme-${light ? 'light' : 'dark'}`
        )
      : html.classList.add(`theme-${light ? 'light' : 'dark'}`);

    localStorage.setItem('theme', light ? 'light' : 'dark');
  }, [light]);

  const toggle = (e): void => {
    e.preventDefault();
    setLight(!light);
  };

  return (
    <div className={styles.container}>
      <label htmlFor={id}>{lightswitch}</label>
      <input type="checkbox" id={id} checked={light} onClick={toggle} />
      <svg
        role="img"
        aria-hidden="true"
        className={classnames(styles.lightbulb, {
          [styles.off]: !light,
        })}
        width="512"
        height="512"
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M255.009 112.419C174.627 112.419 108.422 178.236 108.423 259.001C108.423 313.039 138.012 362.527 185.639 388.153C190.858 390.962 194.101 396.484 194.101 402.567V459.258C194.101 486.579 216.328 508.806 243.649 508.806H266.359C293.679 508.806 315.907 486.579 315.907 459.258V402.569C315.907 396.505 319.289 390.906 324.733 387.957C372.136 362.278 401.585 312.864 401.585 259C401.585 177.981 336.008 112.419 255.009 112.419ZM266.359 475.774H243.649C234.542 475.774 227.133 468.365 227.133 459.258V419H282.875V459.258C282.875 468.365 275.465 475.774 266.359 475.774ZM308.999 358.913C297.976 364.885 289.812 374.601 285.752 385.968H224.292C220.279 374.601 212.201 364.935 201.29 359.065C164.383 339.207 141.455 300.865 141.455 259.001C141.455 196.578 192.94 145.011 255.876 145.454C318.006 145.92 368.552 196.856 368.552 258.999C368.552 300.729 345.732 339.013 308.999 358.913Z" />
        <g>
          <path d="M237.239 214.106C245.669 210.623 249.679 200.965 246.196 192.535C242.712 184.105 233.056 180.092 224.625 183.578C203.937 192.126 187.449 208.99 179.386 229.847C175.198 240.678 183.227 252.322 194.787 252.322C201.412 252.322 207.663 248.308 210.196 241.757C215.013 229.296 224.87 219.217 237.239 214.106Z" />
          <path d="M55.7419 275.48C64.863 275.48 72.2581 268.085 72.2581 258.964C72.2581 249.843 64.863 242.448 55.7419 242.448H16.5161C7.3951 242.448 0 249.843 0 258.964C0 268.085 7.3951 275.48 16.5161 275.48H55.7419Z" />
          <path d="M126.049 412.257C132.5 405.808 132.5 395.35 126.049 388.9C119.599 382.45 109.142 382.45 102.693 388.901L74.9564 416.638C64.5203 427.072 72.0537 444.832 86.6343 444.832C90.8604 444.832 95.0875 443.22 98.3123 439.994L126.049 412.257Z" />
          <path d="M239.52 19.5161V58.7419C239.52 67.863 246.915 75.2581 256.036 75.2581C265.157 75.2581 272.552 67.863 272.552 58.7419V19.5161C272.552 10.3951 265.157 3 256.036 3C246.915 3 239.52 10.3951 239.52 19.5161Z" />
          <path d="M75.0059 77.9554C68.5554 84.4049 68.5554 94.8627 75.0059 101.312L102.744 129.048C105.969 132.274 110.195 133.886 114.422 133.886C128.999 133.886 136.538 116.129 126.1 105.692L98.3628 77.9554C91.9133 71.5048 81.4555 71.5048 75.0059 77.9554Z" />
          <path d="M413.688 78.0059L385.951 105.743C375.515 116.178 383.048 133.938 397.63 133.938C401.856 133.938 406.083 132.325 409.308 129.1L437.045 101.363C443.495 94.9133 443.495 84.4555 437.045 78.0059C430.595 71.5554 420.137 71.5554 413.688 78.0059Z" />
          <path d="M495.484 275.552C504.605 275.552 512 268.157 512 259.036C512 249.914 504.605 242.52 495.484 242.52H456.258C447.137 242.52 439.742 249.915 439.742 259.036C439.742 268.157 447.137 275.552 456.258 275.552H495.484Z" />
          <path d="M436.994 440.045C443.445 433.595 443.445 423.137 436.994 416.688L409.257 388.951C402.808 382.5 392.35 382.5 385.9 388.951C379.45 395.401 379.45 405.858 385.9 412.308L413.637 440.045C420.087 446.495 430.546 446.494 436.994 440.045Z" />
        </g>
      </svg>
    </div>
  );
};

export default Lightswitch;
