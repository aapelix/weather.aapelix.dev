import { Handlers, PageProps } from "$fresh/server.ts";

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
}

interface ForecastDay {
  maxtemp_c: number;
  mintemp_c: number;
  avgtemp_c: number;
  condition: WeatherCondition;
  uv: number;
  daily_chance_of_rain: number;
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
}

interface WeatherCondition {
  icon: string;
  text: string;
}

const apikey = "bd9c5cdff82c476f88681634230707";

export const handler: Handlers<Data> = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    const query = url.searchParams.get("q") || "Helsinki";
    const resp = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=${apikey}&q=${query}&days=2`,
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
        <div class="mx-auto p-5">
          <div class="text-4xl font-black">{result.location.name}</div>
          <div class="text-base">{result.location.country}</div>
          <img
            src={result.current.condition.icon}
            alt="Logo"
            class="mx-auto w-96 h-96"
            style={{ imageRendering: "pixelated" }}
          />
        </div>

        <div class="flex justify-center gap-6">
          <div class="w-1/2 ml-3 mb-3 rounded-full flex justify-center flex-col items-center h-auto aspect-square bg-red-500">
            <div class="text-7xl font-black">
              {result.current.temp_c}°C
            </div>
            <div>Feels like: {result.current.feelslike_c}</div>
          </div>
          <div class="w-1/2 mr-3 mb-3 h-auto aspect-square flex justify-center flex-col items-center">
            <div
              class={`h-1/4 m-2 w-full rounded-full flex justify-center items-center ${
                getUvClass(result.current.uv)
              }`}
            >
              <div class="flex gap-2">
                Current UV: <p class="font-bold">{result.current.uv}</p>
              </div>
            </div>
            <div class="h-1/4 m-2 flex items-center justify-center gap-3 w-full rounded-full bg-[#e0e0e0]">
              <img
                class="h-full ml-5 invert"
                style={{ rotate: result.current.wind_degree + "deg" }}
                src="/arrow2.png"
                alt=""
              />
              <h1 class="mr-5 text-xl">{result.current.wind_kph}km/h</h1>
            </div>
            <div class="h-1/4 m-2 w-full rounded-full bg-[#e0e0e0] flex justify-center items-center">
              <h1>Last updated: {result.current.last_updated}</h1>
            </div>
          </div>
        </div>
        <div class="w-full flex justify-center">
          <div class="flex overflow-x-scroll gap-3 md:w-full w-3/4">
            {result.forecast.forecastday.map((day) => (
              <>
                {day.hour.filter((hour) => {
                  const hourTime = new Date(hour.time.replace(" ", "T"));
                  return hourTime > new Date();
                }).map((hour) => (
                  <div class="h-44 text-center flex flex-col justify-center">
                    <p class="text-xs">{hour.time.slice(-5)}</p>
                    <img
                      class="aspect-square"
                      src={hour.condition.icon}
                      alt=""
                    />
                    <h1>{hour.temp_c.toFixed(1)}°C</h1>
                  </div>
                ))}
              </>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default function Home({ data }: PageProps<Data>) {
  return (
    <section>
      <div class="mx-auto flex max-w-screen-sm flex-col justify-center mt-3">
        <h2 class="text-2xl mb-5 mx-3 text-center">
          <form>
            <input
              name="q"
              type="text"
              placeholder="Search for cities..."
              required
              class="w-full rounded-md py-1.5 px-3.5 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 "
            />
          </form>
        </h2>
        <Weather result={data.result} />
      </div>
    </section>
  );
}
