import * as sapper from '@sapper/app';

import { initClient } from './i18n';

initClient();

sapper.start({
  target: document.querySelector('#root'),
});
