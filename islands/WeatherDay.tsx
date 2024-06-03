import WeatherIcon from "./WeatherIcon.tsx";
import { useState } from "preact/hooks";

export default function WeatherDay(props: { day: any; index: number }) {
  const index = props.index;
  const day = props.day;

  const [open, setOpen] = useState(false);

  function getUvClass(uvIndex: number) {
    if (uvIndex >= 8) {
      return "bg-red-500"; // Very high to extreme UV index
    } else if (uvIndex >= 6) {
      return "bg-orange-500"; // High UV index
    } else if (uvIndex >= 3) {
      return "bg-yellow-500"; // Moderate UV index
    } else {
      return "bg-green-500"; // Low UV index
    }
  }

  return (
    <div
      class="flex flex-col duration-300 items-center min-h-16 cursor-pointer bg-[#1a1a1a] text-white rounded-md mb-1"
      style={{
        borderTopLeftRadius: index == 0 ? "1.5rem" : "0.375rem",
        borderTopRightRadius: index == 0 ? "1.5rem" : "0.375rem",

        borderBottomLeftRadius: index == 6 ? "1.5rem" : "0.375rem",
        borderBottomRightRadius: index == 6 ? "1.5rem" : "0.375rem",
      }}
      onClick={() => setOpen(!open)}
      onfocusout={() => setOpen(false)}
    >
      <div class="flex justify-between w-full items-center">
        <div class="flex gap-3 items-center">
          <p class="text-xl font-semibold ml-3 text-zinc-300">
            {day.date.slice(8, 10)}.{day.date.slice(5, 7)}
          </p>
          <WeatherIcon
            weatherDescription={day.day.condition.text}
            isDay={"day"}
            size="45.28px"
          />
        </div>

        <p class="mr-3 text-xl font-light text-center w-max">
          {Math.floor(day.day.maxtemp_c)}°C / {Math.floor(day.day.mintemp_c)}°C
        </p>
      </div>
      {open
        ? (
          <div class="flex pb-3 flex-wrap justify-around w-[98%]">
            <div
              class={`mx-1 flex justify-center items-center h-16 basis-[30%] rounded-full ${
                getUvClass(day.day.uv)
              }`}
            >
              <p class="text-black">UV: {day.day.uv}</p>
            </div>
            <div class="bg-gradient-to-r text-sm flex justify-center items-center from-blue-700 to-blue-400 rounded-3xl mx-1 h-16 basis-[30%]">
              <p>Chance of rain: {day.day.daily_chance_of_rain}%</p>
            </div>
            <div class="bg-red-500 flex text-sm justify-center items-center rounded-full mx-1 h-16 basis-[30%]">
              <p>Avg temp: {day.day.avgtemp_c}°</p>
            </div>
          </div>
        )
        : null}
    </div>
  );
}
