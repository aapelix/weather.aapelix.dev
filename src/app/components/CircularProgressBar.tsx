import "./CircularProgressBar.css"; // We'll define some CSS later

const CircularProgressBar = ({ size, strokeWidth, percentage }: any) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="circular-progress-bar"
    >
      <circle
        className="circular-progress-bar-bg"
        stroke="#424242"
        strokeWidth={strokeWidth}
        fill="none"
        cx={size / 2}
        cy={size / 2}
        r={radius}
      />
      <circle
        className="circular-progress-bar-fg"
        stroke="#e6e6e6"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        fill="none"
        cx={size / 2}
        cy={size / 2}
        r={radius}
      />
    </svg>
  );
};

export default CircularProgressBar;
