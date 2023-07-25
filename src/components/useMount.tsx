import useMount from '../hooks/LifeCycle/useMount';
import useBoolean from '../hooks/state/useBoolean';


const MyComponent = () => {
  useMount(() => {
    console.info('mount');
  });

  return <div>Hello World</div>;
};

export default () => {
  const [state, { toggle }] = useBoolean(false);

  return (
    <>
      <button type="button" onClick={toggle}>
        {state ? 'unmount' : 'mount'}
      </button>
      {state && <MyComponent />}
    </>
  );
};
