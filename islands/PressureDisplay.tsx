export default function PressureDisplay(props: { pressure: number }) {
  const getPressurePercentage = (pressure: number) => {
    return ((pressure - 950) / (1050 - 950)) * 100;
  };

  return (
    <div className="md:w-44 md:h-44 w-40 h-40 bg-black rounded-3xl m-3 text-white flex justify-center items-center flex-col">
      <p>Pressure: {props.pressure}</p>
    </div>
  );
}
