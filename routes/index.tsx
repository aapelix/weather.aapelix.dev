import { Handlers, PageProps } from "$fresh/server.ts";
import { urlToEsbuildResolution } from "jsr:@luca/esbuild-deno-loader@0.10.3";
import WeatherIcon from "../islands/WeatherIcon.tsx";

interface Data {
  result: WeatherResp | null;
}

interface WeatherResp {
  location: WeatherLocation;
  current: WeatherCurrent;
  forecast: Forecast;
}
interface WeatherLocation {
  name: string;
  country: string;
}

interface Forecast {
  forecastday: {
    date: string;
    day: ForecastDay;
    hour: ForecastHour[];
  }[];
}

interface ForecastHour {
  time: string;
  temp_c: number;
  condition: WeatherCondition;
  feelslike_c: number;
  chance_of_rain: number;
  is_day: number;
}

interface ForecastDay {
  maxtemp_c: number;
  mintemp_c: number;
  avgtemp_c: number;
  condition: WeatherCondition;
  uv: number;
  daily_chance_of_rain: number;
  is_day: number;
}

interface WeatherCurrent {
  temp_c: number;
  temp_f: number;
  condition: WeatherCondition;
  humidity: number;
  feelslike_c: number;
  precip_mm: number;
  wind_kph: number;
  wind_degree: number;
  pressure: number;
  uv: number;
  gust_kph: number;
  last_updated: string;
  is_day: number;
}

interface WeatherCondition {
  icon: string;
  text: string;
}

const apikey = "d288ddcbf4164c50b5e94325242605";

export const handler: Handlers<Data> = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    const query = url.searchParams.get("q") ||
      localStorage.getItem("last_search") || "Helsinki";
    const resp = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=${apikey}&q=${query}&days=7&alerts=yes&aqi=yes`,
    );

    if (resp.status == 200) {
      const result: WeatherResp = await resp.json();
      return ctx.render({ result });
    }
    return ctx.render({ result: null });
  },
};

function Weather({ result }: Data) {
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

  if (!result) {
    return (
      <div class="mt-10">
        <h2 class="text-center text-2xl font-bold">404 - Not found</h2>
      </div>
    );
  } else {
    return (
      <div class="text-center">
        <div class="mx-auto p-5 text-white">
          <div class="text-4xl font-black">{result.location.name}</div>
          <div class="text-base mb-3">{result.location.country}</div>
          <WeatherIcon
            weatherDescription={result.current.condition.text}
            isDay={result.current.is_day == 1 ? "day" : "night"}
            size="22rem"
          />
        </div>
        <div class="flex justify-center gap-6">
          <div class="w-1/2 ml-3 mb-3 rounded-full flex justify-center text-white flex-col items-center h-auto aspect-square bg-red-500">
            <div class="md:text-7xl text-5xl font-black">
              {result.current.temp_c}°C
            </div>
            <div>Feels like: {result.current.feelslike_c}</div>
          </div>
          <div class="w-1/2 mr-3 mb-3 h-auto aspect-square flex justify-center flex-col items-center ">
            <div
              class={`h-1/4 m-2 w-full rounded-full flex justify-center items-center ${
                getUvClass(result.current.uv)
              }`}
            >
              <div class="flex gap-2">
                Current UV: <p class="font-bold">{result.current.uv}</p>
              </div>
            </div>
            <div class="h-1/4 m-2 flex items-center justify-center gap-3 w-full rounded-full bg-[#1a1a1a]">
              <img
                class="h-full ml-5"
                style={{ rotate: result.current.wind_degree + "deg" }}
                src="/arrow2.png"
                alt=""
              />
              <h1 class="mr-5 text-xl text-white">
                {result.current.wind_kph}km/h
              </h1>
            </div>
            <div class="h-1/4 m-2 w-full rounded-full bg-[#1a1a1a] text-white flex justify-center items-center">
              <h1 class="md:text-base text-xs">
                Last updated: {result.current.last_updated}
              </h1>
            </div>
          </div>
        </div>
        <div class="w-full flex justify-center">
          <div class="flex overflow-x-scroll gap-5 md:w-full w-screen mx-2 bg-[#1a1a1a] text-white rounded-3xl px-4">
            {result.forecast.forecastday.map((day) => (
              <>
                {day.hour.filter((hour) => {
                  const hourTime = new Date(hour.time.replace(" ", "T"));
                  return hourTime > new Date();
                }).slice(0, 30).map((hour) => (
                  <div class="h-36 text-center flex flex-col justify-center">
                    <p class="text-xs text-center w-full text-zinc-300">
                      {hour.time.slice(8, 10)}.{hour.time.slice(5, 7)}
                    </p>
                    <p class="text-sm">{hour.time.slice(-5)}</p>
                    <WeatherIcon
                      weatherDescription={hour.condition.text}
                      isDay={hour.is_day == 1 ? "day" : "night"}
                      size="45.28px"
                    />
                    <h1 class="text-lg font-semibold">
                      {Math.floor(hour.temp_c)}°
                    </h1>
                  </div>
                ))}
              </>
            ))}
          </div>
        </div>
        <div class="w-full flex justify-center mt-5">
          <div class="flex flex-col md:w-full w-screen mx-2">
            {result.forecast.forecastday.map((day, index) => (
              <div
                class="flex justify-between items-center h-16 bg-[#1a1a1a] text-white rounded-md mb-1"
                style={{
                  borderTopLeftRadius: index == 0 ? "1.5rem" : "0.375rem",
                  borderTopRightRadius: index == 0 ? "1.5rem" : "0.375rem",

                  borderBottomLeftRadius: index == 6 ? "1.5rem" : "0.375rem",
                  borderBottomRightRadius: index == 6 ? "1.5rem" : "0.375rem",
                }}
              >
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
                  {Math.floor(day.day.maxtemp_c)}°C /{" "}
                  {Math.floor(day.day.mintemp_c)}°C
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default function Home({ data }: PageProps<Data>) {
  return (
    <>
      <section class="animate-load">
        <div class="mx-auto flex max-w-screen-sm flex-col justify-center mt-3 pb-24">
          <h2 class="text-xl mb-5 mx-3 text-center">
            <form>
              <input
                name="q"
                type="text"
                placeholder="Search..."
                required
                autoComplete="off"
                class="w-1/3 duration-300 focus:w-3/4 py-1 px-3.5 text-white bg-[#1a1a1a] rounded-full placeholder:text-gray-400 "
              />
            </form>
          </h2>
          <Weather result={data.result} />
        </div>
      </section>
    </>
  );
}
