import dynamic from 'next/dynamic';
import { createElement } from 'preact';
import { useText, Text } from 'preact-i18n';

import SocialData from 'data/social.json';

import styles from 'components/Footer/Social.module.css';

const SocialLink = ({
  profile,
  provider,
  username,
}: {
  profile: string;
  provider: string;
  username: string;
}): JSX.Element => {
  const { title } = useText({
    title: <Text id="social.link" fields={{ provider, username }} />,
  });
  const p = provider.toLowerCase();
  return (
    <a
      title={title}
      href={profile}
      rel="noindex,nofollow,noreferrer,noopener"
      target="_blank"
    >
      {createElement(
        dynamic(
          () => import(`assets/icons/${p === 'website' ? 'user' : p}.svg`)
        ),
        null
      )}
    </a>
  );
};

const SocialList = (): JSX.Element => {
  const renderList = SocialData.map(
    ({ profile, provider, username }): JSX.Element => (
      <li key={`social-${provider}`}>
        <SocialLink {...{ profile, provider, username }} />
      </li>
    )
  );
  return SocialData.length > 0 && <ul className={styles.list}>{renderList}</ul>;
};

export default SocialList;
