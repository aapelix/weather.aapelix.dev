import { Handlers, PageProps } from "$fresh/server.ts";
import WeatherIcon from "../islands/WeatherIcon.tsx";
import PressureDisplay from "../islands/PressureDisplay.tsx";
import Search from "../islands/Search.tsx";
import WeatherDay from "../islands/WeatherDay.tsx";
import { generateImageUrl } from "../utils/genImgUrl.ts";

interface Data {
  result: WeatherResp | null;
  result2: SportResp | null;
}

interface SportResp {
  football: {
    stadium: string;
    country: string;
    tournament: string;
    start: string;
    match: string;
  }[];
}

interface WeatherResp {
  location: WeatherLocation;
  current: WeatherCurrent;
  forecast: Forecast;
}
interface WeatherLocation {
  name: string;
  country: string;
  localtime: string;
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
  pressure_mb: number;
  uv: number;
  gust_kph: number;
  last_updated: string;
  is_day: number;
  air_quality: {
    co: number;
    no2: number;
    o3: number;
    so2: number;
    pm2_5: number;
    pm10: number;
    "us-epa-index": number;
    "gb-defra-index": number;
  };
}

interface WeatherCondition {
  icon: string;
  text: string;
}

const apikey = "d288ddcbf4164c50b5e94325242605";

export const handler: Handlers<Data> = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    const query = url.searchParams.get("q") || "Helsinki";
    const resp = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=${apikey}&q=${query}&days=7&alerts=yes&aqi=yes`,
    );

    const resp2 = await fetch(
      `https://api.weatherapi.com/v1/sports.json?key=${apikey}&q=${query}`,
    );

    if (resp.status == 200 && resp2.status == 200) {
      const result: WeatherResp = await resp.json();
      const result2 = await resp2.json();
      return ctx.render({ result, result2 });
    }
    return ctx.render({ result: null, result2: null });
  },
};

function Weather({ result, result2 }: Data) {
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

  const airQualityDescriptions = {
    "us-epa-index": [
      "Good",
      "Moderate",
      "Unhealthy for Sensitive Groups",
      "Unhealthy",
      "Very Unhealthy",
      "Hazardous",
    ],
    "gb-defra-index": ["Low", "Moderate", "High", "Very High"],
  };

  const getAqiClass = (aqiString: string) => {
    if (aqiString === "Good") return "bg-green-500";
    else if (aqiString === "Moderate") return "bg-yellow-500";
    else if (aqiString === "Unhealthy for Sensitive Groups") {
      return "bg-orange-500";
    } else if (aqiString === "Unhealthy") return "bg-red-500";
    else if (aqiString === "Very Unhealthy") return "bg-purple-500";
    else if (aqiString === "Hazardous") return "bg-pink-900";
    else return ""; // default case if none of the levels match
  };

  if (!result || !result2) {
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
              <WeatherDay day={day} index={index} />
            ))}
          </div>
        </div>
        <div class="mt-5 flex flex-wrap w-full justify-center">
          <div class="mx-2 md:w-full w-screen grid md:grid-cols-3 grid-cols-2 bg-[#1a1a1a] rounded-3xl">
            <PressureDisplay pressure={result.current.pressure_mb} />
            <div className="md:w-44 md:h-44 w-40 h-40 bg-[#2b2b2b] rounded-3xl m-3 flex flex-col justify-center items-center text-white">
              <p>Local time:</p>
              <p class="text-2xl font-bold">
                {result.location.localtime.slice(-5)}
              </p>
              <p class="text-xs">(may be incorrect)</p>
            </div>
            <div
              className={"md:w-44 md:h-44 w-40 h-40 rounded-3xl m-3 text-white flex justify-center items-center text-2xl flex-col " +
                getAqiClass(
                  airQualityDescriptions["us-epa-index"][
                    result.current.air_quality["us-epa-index"]
                  ],
                )}
            >
              <p>
                AQI:
              </p>
              <p class="font-bold">
                {airQualityDescriptions["us-epa-index"][
                  result.current.air_quality["us-epa-index"]
                ]}
              </p>
            </div>
            <div className="md:w-44 md:h-44 w-40 h-40 md:hidden bg-[#2b2b2b] rounded-3xl m-3 flex flex-col justify-center items-center text-white">
              <p>Humidity</p>
              <p class="text-2xl font-bold">
                {result.current.humidity}%
              </p>
            </div>
          </div>
        </div>
        <div class="mt-5 flex flex-wrap w-full justify-center ">
          <div class="md:w-full w-screen mx-2 bg-[#1a1a1a] rounded-3xl py-2">
            <h1 class="text-white font-bold">Sport events nearby</h1>
            <div class="flex justify-center items-center w-full flex-col">
              {result2.football.map((football) => {
                return (
                  <div class="w-[95%] bg-[#2b2b2b] flex justify-between text-left py-1 my-1 rounded-xl text-white">
                    <div class="ml-2">
                      <h1 class="font-semibold">{football.match}</h1>
                      <p>{football.tournament}</p>
                    </div>
                    <div class="mr-2">
                      <p class="text-right">Starting at</p>
                      <p>
                        {football.start.slice(8, 10)}.{football.start.slice(
                          5,
                          7,
                        )} {football.start.slice(-5)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <p class="text-xs text-white">(experimental)</p>
          </div>
        </div>
      </div>
    );
  }
}

export default function Home({ data }: PageProps<Data>) {
  const imgUrl = generateImageUrl(data.result);

  return (
    <>
      <section class="animate-load">
        <div class="mx-auto flex max-w-screen-sm flex-col justify-center mt-3 pb-24">
          <meta content={imgUrl} property="og:image" />
          <Search />
          <Weather result={data.result} result2={data.result2} />
        </div>
      </section>
    </>
  );
}
