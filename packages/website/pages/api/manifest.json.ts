import { NextApiRequest, NextApiResponse } from 'next';

import data from 'data/manifest';

export default (_req: NextApiRequest, res: NextApiResponse): void => {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
};
