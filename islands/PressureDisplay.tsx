export default function PressureDisplay(props: { pressure: number }) {
  const getPressurePercentage = (pressure: number) => {
    return ((pressure - 950) / (1050 - 950)) * 100;
  };

  return (
    <div className="w-44 h-44 bg-black rounded-3xl m-3 text-white flex justify-center items-center flex-col">
      <p>Pressure: {props.pressure}</p>
    </div>
  );
}
