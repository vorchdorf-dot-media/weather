import dayjs, { ConfigType, Dayjs } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useMemo } from 'preact/hooks';

dayjs.extend(relativeTime);

const useLocale = (locale: string): ((param: ConfigType) => Dayjs) => {
  useMemo(() => {
    dayjs.locale(locale) !== locale &&
      import('dayjs/locale/de').then(({ default: loc }) =>
        dayjs.locale(loc, null, false)
      );
  }, [locale]);

  return dayjs;
};

export default useLocale;
