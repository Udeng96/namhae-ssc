import '@/assets/css/spinner.css';

const Spinner = () => (
  <div className="spinner-wrap">
    <div className="spinner-loading">
      <svg className="spinner" width="48px" height="48px" viewBox="0 0 48 48">
        <defs>
          <linearGradient id="Gradient1">
            <stop className="stop1" offset="0%" />
            <stop className="stop2" offset="100%" />
          </linearGradient>
        </defs>
        <circle
          className="path"
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          cx="24"
          cy="24"
          r="20.5"
        />
      </svg>
    </div>
  </div>
);

export default Spinner;
