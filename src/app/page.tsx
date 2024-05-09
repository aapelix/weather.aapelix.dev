"use client";

import { ModeToggle } from "@/components/theme-toggle";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";

import cities from "../data.json";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Sun,
  Cloud,
  CloudSun,
  Cloudy,
  CloudRainWind,
  CloudSunRain,
  CloudLightning,
  Snowflake,
  CloudFog,
  CalendarIcon,
  Sunrise,
  Sunset,
  Search,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    temp_max: number;
    temp_min: number;
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
  // Add other necessary properties
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

export default function Home() {
  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

  const [searched, setSearched] = useState(false);
  const [input, setInput] = useState("");
  const [weather, setWeather] = useState<WeatherData>();
  const [cityName, setCityName] = useState("");

  const [coords, setCoords] = useState<GeolocationCoordinates>();

  const [date, setDate] = useState<Date | undefined>(new Date());

  const filteredCities = cities.municipalities.filter((city) =>
    city.name.toLowerCase().startsWith(input.toLowerCase())
  );

  const searchWeather = async (city: {
    name: string;
    longitude: number;
    latitude: number;
  }) => {
    console.log(city.name + " " + city.longitude + " " + city.latitude);

    setCityName(city.name);

    const data = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${city.latitude}&lon=${city.longitude}&appid=${apiKey}&units=metric`
    );

    const res = await data.json();

    console.log(res);

    setWeather(res);

    setSearched(true);
    setInput("");
  };

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

  return (
    <main className="h-screen w-screen dark:bg-[#070707] dark:text-zinc-100 overflow-hidden">
      <div className="flex flex-col items-center duration-500 animate-in animate fade-in-5 slide-in-from-bottom-2.5">
        <ModeToggle />
        {!searched ? (
          <div className="flex justify-center flex-col h-screen items-center">
            <h1 className="text-5xl font-bold tracking-tight text-center">
              Weather Search ⛅
            </h1>

            <div className="flex flex-row">
              <Button
                className="md:translate-y-4 translate-y-3 rounded-full w-12 h-12 absolute md:-translate-x-16 md:bg-white bg-transparent translate-x-64"
                onClick={getLocation}
              >
                <MapPin className="md:block hidden" />
                <MapPin color="#ffffff" className="md:hidden block" />
              </Button>
              <div className="h-min w-96 mt-4">
                <Command>
                  <CommandInput
                    value={input}
                    onValueChange={setInput}
                    placeholder="Search..."
                    className="placeholder:text-zinc-500"
                  />

                  <Button
                    className="absolute translate-x-72 w-20 duration-300 bg-transparent text-zinc-200 hover:text-zinc-800"
                    onClick={() => searchWeather(filteredCities[0])}
                  >
                    Search
                  </Button>

                  <CommandList>
                    {input !== "" && input !== undefined ? (
                      <>
                        <CommandEmpty>No results found.</CommandEmpty>

                        <CommandGroup heading="Results">
                          {filteredCities.map((city) => (
                            <CommandItem
                              key={city.name}
                              value={city.name}
                              onSelect={setInput}
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
            </div>
          </div>
        ) : (
          <div>
            <div className="flex flex-row left-1/2 absolute -translate-x-1/2">
              <Button
                className="md:translate-y-4 translate-y-3 rounded-full w-12 h-12 absolute md:-translate-x-16 md:bg-white bg-transparent translate-x-64"
                onClick={getLocation}
              >
                <MapPin className="md:block hidden" />
                <MapPin color="#ffffff" className="md:hidden block" />
              </Button>

              <div className="h-min w-96 mt-4">
                <Command>
                  <CommandInput
                    value={input}
                    onValueChange={setInput}
                    placeholder="Search..."
                    className="placeholder:text-zinc-500"
                  />

                  <Button
                    className="absolute translate-x-72 w-20 duration-300 bg-transparent text-zinc-200 hover:text-zinc-800"
                    onClick={() => searchWeather(filteredCities[0])}
                  >
                    Search
                  </Button>

                  <CommandList>
                    {input !== "" && input !== undefined ? (
                      <>
                        <CommandEmpty>No results found.</CommandEmpty>

                        <CommandGroup heading="Results">
                          {filteredCities.map((city) => (
                            <CommandItem
                              key={city.name}
                              value={city.name}
                              onSelect={setInput}
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
            </div>

            {weather ? (
              <div className="text-center mt-24 flex items-center flex-col flex-wrap">
                <div className="flex flex-row items-center flex-wrap text-center">
                  <h1 className="text-3xl mr-4">{cityName}</h1>
                  <div className="w-44 h-44 outline-1 flex justify-center items-center flex-col border-zinc-600 border-2 mt-3 rounded-2xl">
                    <h1 className="text-6xl font-bold">
                      {Math.floor(weather.main.temp)}°C
                    </h1>
                    <p>feels like {Math.floor(weather.main.feels_like)}°C</p>
                  </div>
                </div>
                <div className="mt-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex items-center flex-wrap mt-10">
                  <div className="text-center bg-[#0e0e0e] mr-5 h-44 w-44 flex justify-center items-center rounded-[5rem] flex-col mx-2">
                    <img
                      src="/arrow2.png"
                      style={{
                        transform: `rotate(${360 - weather.wind.deg}deg)`,
                      }}
                      alt=""
                    />
                    <p className="absolute -translate-y-[4.5rem] text-sm">N</p>
                    <p className="absolute translate-x-[4.5rem] text-sm">E</p>
                    <p className="absolute translate-y-[4.5rem] text-sm">S</p>
                    <p className="absolute -translate-x-[4.5rem] text-sm">W</p>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="w-44 h-44 border-[1px] border-zinc-700 rounded-xl mr-3 flex justify-center items-center flex-col">
                          {weather.weather[0].icon == "01d" ? (
                            <Sun className="w-36 h-36" />
                          ) : null}
                          {weather.weather[0].icon == "02d" ? (
                            <CloudSun className="w-36 h-36" />
                          ) : null}
                          {weather.weather[0].icon == "03d" ? (
                            <Cloud className="w-36 h-36" />
                          ) : null}
                          {weather.weather[0].icon == "04d" ? (
                            <Cloudy className="w-36 h-36" />
                          ) : null}
                          {weather.weather[0].icon == "09d" ? (
                            <CloudRainWind className="w-36 h-36" />
                          ) : null}
                          {weather.weather[0].icon == "10d" ? (
                            <CloudSunRain className="w-36 h-36" />
                          ) : null}
                          {weather.weather[0].icon == "11d" ? (
                            <CloudLightning className="w-36 h-36" />
                          ) : null}
                          {weather.weather[0].icon == "13d" ? (
                            <Snowflake className="w-36 h-36" />
                          ) : null}
                          {weather.weather[0].icon == "50d" ? (
                            <CloudFog className="w-36 h-36" />
                          ) : null}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{weather.weather[0].description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <div className="w-44 h-44 rounded-2xl text-center lg:flex justify-center items-center flex-col sm:hidden hidden">
                    <p>Sunrise {timeConverter(weather.sys.sunrise, true)}</p>
                    <Sunrise className="w-32 h-32" />
                  </div>
                  <div className="w-44 h-44 rounded-2xl text-center lg:flex justify-center items-center flex-col sm:hidden hidden">
                    <p>Sunset {timeConverter(weather.sys.sunrise, true)}</p>
                    <Sunset className="w-32 h-32" />
                  </div>
                </div>
                <div className="flex items-center flex-wrap">
                  <div className="w-44 h-44 rounded-2xl text-center sm:flex justify-center items-center flex-col lg:hidden flex">
                    <p>Sunrise {timeConverter(weather.sys.sunrise, true)}</p>
                    <Sunrise className="w-32 h-32" />
                  </div>
                  <div className="w-44 h-44 rounded-2xl text-center sm:flex justify-center items-center flex-col lg:hidden flex">
                    <p>Sunset {timeConverter(weather.sys.sunrise, true)}</p>
                    <Sunset className="w-32 h-32" />
                  </div>
                </div>
                <div className="border-2 border-zinc-600 p-3 rounded-2xl mt-4">
                  <p>Humidity: {weather.main.humidity}</p>
                  <Progress
                    value={weather.main.humidity}
                    className="w-[45vw]"
                  />
                </div>
              </div>
            ) : (
              <h1>404 | Not found</h1>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
