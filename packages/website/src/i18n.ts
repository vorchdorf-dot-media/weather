import type { IncomingMessage, ServerResponse } from 'http';
import type { RequestHandler } from 'sirv';
import {
  locale as $locale,
  register,
  init,
  getLocaleFromNavigator,
} from 'svelte-i18n';

const locales = ['de', 'en'];
const regex = /\w{2}(?:-\w{2})?/gi;

const INIT_OPTIONS = {
  fallbackLocale: 'en',
  initialLocale: null,
  loadingDelay: 200,
  formats: {},
  warnOnMissingMessages: true,
};

let current: string = null;

locales.forEach(locale =>
  register(locale, () => import(`../locales/${locale}.json`))
);

$locale.subscribe((locale: string): void => {
  if (!locale) {
    return;
  }
  current = locale;
});

export const initClient = (): void =>
  init({
    ...INIT_OPTIONS,
    initialLocale: getLocaleFromNavigator(),
  });

// init only for routes (urls with no extensions such as .js, .css, etc) and for service worker
const DOCUMENT_REGEX = /(^([^.?#@]+)?([?#](.+)?)?|service-worker.*?\.html)$/;
export const middleware = (): RequestHandler => {
  init(INIT_OPTIONS);

  return (req: IncomingMessage, _res: ServerResponse, next: VoidFunction) => {
    if (DOCUMENT_REGEX.test(req.url)) {
      return next();
    }
    if (
      current === INIT_OPTIONS.fallbackLocale &&
      req.headers['accept-language']
    ) {
      let filtered: RegExpExecArray;
      while ((filtered = regex.exec(req.headers['accept-language'])) !== null) {
        const [locale] = filtered;
        if (locales.indexOf(locale) > -1) {
          locale !== current && $locale.set(locale);
          break;
        }
      }
    } else {
      $locale.set(
        current || INIT_OPTIONS.initialLocale || INIT_OPTIONS.fallbackLocale
      );
    }
    return next();
  };
};
