"use client";

import { Button } from "@/components/ui/button";
import cities from "../data.json";
import { MapPin, Search } from "lucide-react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { useEffect, useState } from "react";
import WeatherIcon from "./components/weatherIcon";
import ForeCastItem from "./components/foreCastItem";
import CircularProgressBar from "./components/CircularProgressBar";

interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    temp_max: number;
    temp_min: number;
    pressure: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
    deg: number;
  };
  sys: {
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  // Add other necessary properties
}

interface ForecastData {
  list: {
    dt_txt: string;
    weather: {
      description: string;
      icon: string;
    }[];
    main: {
      temp: number;
      feels_like: number;
      humidity: number;
      temp_max: number;
      temp_min: number;
    };
  }[];
}

function timeConverter(UNIX_timestamp: number, only_time: boolean) {
  var a = new Date(UNIX_timestamp * 1000);
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();

  var time =
    date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;

  if (only_time) {
    time = hour + ":" + min + ":" + sec;
  }

  return time;
}

export default function MobileSite() {
  const [input, setInput] = useState("");
  const [searched, setSearched] = useState(false);
  const [cityName, setCityName] = useState("");
  const [weather, setWeather] = useState<WeatherData>();
  const [forecast, setForecast] = useState<ForecastData>();
  const [coords, setCoords] = useState<GeolocationCoordinates>();
  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

  const searchWeather = async (city: {
    name: string;
    longitude: number;
    latitude: number;
  }) => {
    console.log(city.name + " " + city.longitude + " " + city.latitude);

    localStorage.setItem("recent1", city.name);

    setCityName(city.name);

    const data = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${city.latitude}&lon=${city.longitude}&appid=${apiKey}&units=metric`
    );

    const data2 = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${city.latitude}&lon=${city.longitude}&appid=${apiKey}&units=metric`
    );

    const res = await data.json();
    const res2 = await data2.json();

    console.log(res);
    console.log(res2);

    setWeather(res);
    setForecast(res2);

    setSearched(true);
    setInput("");
  };

  const filteredCities = cities.municipalities.filter((city) =>
    city.name.toLowerCase().startsWith(input.toLowerCase())
  );

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setCoords(coords);
        console.log(coords);
      },
      (error) => {
        console.error(error.message);
      }
    );

    if (coords) {
      searchWeather({
        name: "",
        longitude: coords?.longitude,
        latitude: coords.latitude,
      });
    }
  };

  useEffect(() => {
    if (coords) {
      searchWeather({
        name: "",
        longitude: coords?.longitude,
        latitude: coords.latitude,
      });
    }
  }, [coords]);

  return (
    <main className="h-screen w-screen bg-[#0e0e0e] text-zinc-100 pb-6 overflow-x-hidden">
      <div className="flex flex-col items-start ml-5 duration-500 animate-in animate fade-in-5 slide-in-from-bottom-2.5">
        <div className="flex flex-row flex-nowrap gap-3 mt-3 absolute z-50">
          <Button
            className="rounded-full bg-white w-12 h-12"
            onClick={getLocation}
          >
            <MapPin color="#070707" />
          </Button>
          <Command className="w-64">
            <CommandInput
              value={input}
              onValueChange={setInput}
              placeholder="Search..."
            />

            <Button
              className="absolute bg-transparent translate-y-0.5 right-0 translate-x-3 focus:bg-transparent hover:bg-transparent"
              onClick={() => searchWeather(filteredCities[0])}
            >
              <Search
                className="bg-[#070707] w-10 h-10 p-2 rounded-3xl"
                color="#ffffff"
              />
            </Button>

            <CommandList>
              {input !== "" && input !== undefined ? (
                <>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    {filteredCities.map((city) => (
                      <CommandItem
                        key={city.name}
                        value={city.name}
                        onSelect={() => searchWeather(city)}
                      >
                        {city.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              ) : null}
            </CommandList>
          </Command>
        </div>
        {searched && weather && forecast ? (
          <div className="mt-24">
            <div className="flex flex-row items-center w-screen justify-between">
              <div>
                {cityName !== "" ? (
                  <h1 className="text-lg">{cityName}</h1>
                ) : (
                  <h1 className="text-lg">{weather.name}</h1>
                )}
                <h1 className="text-5xl font-black">
                  {Math.floor(weather.main.temp)}°C
                </h1>
                <p className="text-xs">
                  feels like {Math.floor(weather.main.feels_like)}°C
                </p>
              </div>
              <div className="-translate-x-8">
                <WeatherIcon icon={weather.weather[0].icon} />
              </div>
            </div>
            <h1 className="mt-16 font-black">3-hour forecast</h1>
            <div className="text-center flex flex-row flex-nowrap overflow-x-auto w-[90vw]">
              <div className="w-24 h-44 bg-[#0f0f0f] m-1 rounded-sm rounded-l-3xl">
                <ForeCastItem data={forecast.list[0]} />
              </div>
              <div className="w-24 h-44 bg-[#0f0f0f] m-1 rounded-sm">
                <ForeCastItem data={forecast.list[1]} />
              </div>
              <div className="w-24 h-44 bg-[#0f0f0f] m-1 rounded-sm">
                <ForeCastItem data={forecast.list[2]} />
              </div>
              <div className="w-24 h-44 bg-[#0f0f0f] m-1 rounded-sm">
                <ForeCastItem data={forecast.list[3]} />
              </div>
              <div className="w-24 h-44 bg-[#0f0f0f] m-1 rounded-sm">
                <ForeCastItem data={forecast.list[4]} />
              </div>
              <div className="w-24 h-44 bg-[#0f0f0f] m-1 rounded-sm">
                <ForeCastItem data={forecast.list[5]} />
              </div>
              <div className="w-24 h-44 bg-[#0f0f0f] m-1 rounded-sm">
                <ForeCastItem data={forecast.list[6]} />
              </div>
              <div className="w-24 h-44 bg-[#0f0f0f] m-1 rounded-sm">
                <ForeCastItem data={forecast.list[7]} />
              </div>
              <div className="w-24 h-44 bg-[#0f0f0f] m-1 rounded-sm">
                <ForeCastItem data={forecast.list[8]} />
              </div>
              <div className="w-24 h-44 bg-[#0f0f0f] m-1 rounded-sm rounded-r-3xl">
                <ForeCastItem data={forecast.list[9]} />
              </div>
            </div>
            <div className="mt-5">
              <h1 className="font-black">Weather now</h1>
              <div className="grid grid-cols-2 mt-2 -translate-x4 gap-y-4 weather-grid">
                <div className="w-40 h-40 bg-[#0f0f0f] rounded-full flex justify-center items-center">
                  <img
                    src="/arrow2.png"
                    className="w-32 h-32"
                    style={{
                      transform: `rotate(${360 - weather.wind.deg}deg)`,
                    }}
                    alt=""
                  />
                </div>
                <div className="w-40 h-40 bg-[#0f0f0f] rounded-xl flex justify-center flex-col items-center text-center">
                  Pressure: <br />
                  <p className="text-2xl font-bold">
                    {weather.main.pressure}kPa
                  </p>
                </div>
                <div className="w-40 h-40 bg-[#0f0f0f] flex justify-center items-center rounded-3xl">
                  <CircularProgressBar
                    size={100}
                    strokeWidth={10}
                    percentage={weather.main.humidity}
                  />
                </div>
                <div className="w-40 h-40 bg-[#0f0f0f] rounded-xl text-center flex justify-center items-center flex-col">
                  <p>Max / Min</p>
                  <p className="font-black text-lg">
                    {Math.floor(weather.main.temp_max)}°C /{" "}
                    {Math.floor(weather.main.temp_min)}°C
                  </p>
                </div>
                <div className="w-[23rem] h-40 bg-[#0f0f0f] rounded-xl col-span-2 flex flex-col items-center">
                  <div className="flex justify-between w-[80%] mt-2">
                    <p>Sunrise</p>
                    <p>Sunset</p>
                  </div>
                  <div className="flex justify-between w-[80%] font-black">
                    <p>
                      {timeConverter(weather.sys.sunrise, true).slice(0, 4)}
                    </p>
                    <p>{timeConverter(weather.sys.sunset, true).slice(0, 4)}</p>
                  </div>
                  <p className="translate-y-5">Nothing here yet 👀</p>
                </div>
              </div>
            </div>
<p>Data from OpenWeatherMap.org</p>
          </div>
        ) : (
          <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-black text-xl">
            Search something
          </h1>
        )}
      </div>
    </main>
  );
}
