import { LuLoaderCircle } from "react-icons/lu";


const Loading = ({fullScreen = false, size = 20}) => {
  const spinner = (
    <LuLoaderCircle className={"animate-spin"} size={size} />
  );

  if (fullScreen) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        {spinner}
      </div>
    );
  }

  return spinner;
};


export default Loading;


Loading.propTypes = {
  fullScreen: PropTypes.bool,
  size: PropTypes.number,
};
