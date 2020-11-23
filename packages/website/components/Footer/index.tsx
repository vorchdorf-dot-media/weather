import SocialData from 'data/social.json';

const Footer = (): JSX.Element => (
  <footer>
    {SocialData.length > 0 && (
      <ul>
        {SocialData.map(
          ({ profile, provider, username }): JSX.Element => (
            <li key={`social-${provider}`}>
              <a href={profile} rel="noreferrer,noopener">
                <strong>{username}</strong> on {provider}
              </a>
            </li>
          )
        )}
      </ul>
    )}
  </footer>
);

export default Footer;
