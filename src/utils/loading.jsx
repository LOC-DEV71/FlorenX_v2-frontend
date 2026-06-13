import "./loading.scss";

function Loading() {
  return (
    <div className="vx-loader-wrapper">
      <div className="vx-loader-core">
        <div className="vx-spinner">
          <div className="vx-spinner-ring"></div>
          <div className="vx-spinner-ring"></div>
          <div className="vx-spinner-dot"></div>
        </div>
        <div className="vx-loader-text">
          <span>L</span>
          <span>O</span>
          <span>A</span>
          <span>D</span>
          <span>I</span>
          <span>N</span>
          <span>G</span>
        </div>
      </div>
    </div>
  );
}

export default Loading;