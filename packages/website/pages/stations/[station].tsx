import { useRouter } from 'next/router';

const Station = (): JSX.Element => {
  const { asPath, query: { station } = {} } = useRouter();
  console.log(asPath);
  return <div>ID for page: {station}</div>;
};

export default Station;
