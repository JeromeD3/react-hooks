

export default () => {
  const size = useSize(document.querySelector('body'));
  return (
    <div>
      <p>Try to resize the preview window </p>
      <p>
        width: {size?.width}px, height: {size?.height}px
      </p>
    </div>
  );
};
