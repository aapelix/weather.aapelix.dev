import { Handlers, PageProps } from "$fresh/server.ts";

interface Data {
  result: WeatherResp | null;
}

interface WeatherResp {
  location: WeatherLocation;
  current: WeatherCurrent;
}
interface WeatherLocation {
  name: string;
  country: string;
}

interface WeatherCurrent {
  temp_C: number;
  temp_f: number;
  condition: WeatherCondition;
  humidity: number;
  feelslike_c: number;
  precip_mm: number;
  wind_kph: number;
  uv: number;
  gust_kph: number;
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
      `http://api.weatherapi.com/v1/forecast.json?key=${apikey}&q=${query}`,
    );

    if (resp.status == 200) {
      const result: WeatherResp = await resp.json();
      return ctx.render({ result });
    }
    return ctx.render({ result: null });
  },
};

function Weather({ result }: Data) {
  if (!result) {
    return (
      <div class="mt-10">
        <h2 class="text-center text-2xl font-bold">404</h2>
      </div>
    );
  } else {
    return (
      <div class="text-center">
        <div class="mx-auto p-5">
          <div class="text-2xl font-bold">{result.location.name}</div>
          <div class="text-xl ">{result.location.country}</div>
          <div class="text-4xl my-4">{result.current.temp_C}</div>
          <div class="text-md ">{result.current.condition.text}</div>
          <img src={result.current.condition.icon} alt="Logo" class="mx-auto" />
        </div>

        <div class="bg-blue-200 rounded shadow p-10 grid grid-cols-2 gap-4">
          <div>Feels like: {result.current.feelslike_c}</div>
          <div>humidity: {result.current.humidity}</div>
          <div>Percipitation: {result.current.precip_mm}</div>
          <div>Current UV: {result.current.uv}</div>
          <div>Winds: {result.current.wind_kph}</div>
          <div>Gust: {result.current.gust_kph}</div>
        </div>
      </div>
    );
  }
}

export default function Home({ data }: PageProps<Data>) {
  return (
    <section>
      <div class="mt-10 px-5 rounded shadow mx-auto flex max-w-screen-md flex-col justify-center py-12">
        <h2 class="text-2xl font-bold mb-5 text-center">
          weather.aapelix.dev
          <form>
            <input
              name="q"
              type="text"
              placeholder="Enter a city..."
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
