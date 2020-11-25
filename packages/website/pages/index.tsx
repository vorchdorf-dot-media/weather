import { useText } from 'preact-i18n';

const Index = () => {
  const { title } = useText('index.title');
  return (
    <>
      <h1>{title}</h1>
    </>
  );
};

export default Index;
