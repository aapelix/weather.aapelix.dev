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
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";

import cities from "../data.json";
import { Button } from "@/components/ui/button";

interface WeatherData {
  name: string;
  main: {
    icon: string;
    temp: number;
    feels_like: number;
    humidity: number;
    temp_max: number;
    temp_min: number;
  };
  weather: {
    description: string;
  }[];
  wind: {
    speed: number;
    deg: number;
  };
  // Add other necessary properties
}

export default function Home() {
  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

  const [searched, setSearched] = useState(false);
  const [input, setInput] = useState("");
  const [weather, setWeather] = useState<WeatherData>();

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

    const data = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${city.latitude}&lon=${city.longitude}&appid=${apiKey}&units=metric`
    );

    const res = await data.json();

    console.log(res);

    setWeather(res);

    setSearched(true);
    setInput("");
  };

  return (
    <main className="h-screen w-screen dark:bg-[#070707] dark:text-zinc-100 overflow-hidden">
      <div className="flex flex-col items-center duration-500 animate-in animate fade-in-5 slide-in-from-bottom-2.5">
        <ModeToggle />
        {!searched ? (
          <div className="flex justify-center flex-col h-screen items-center">
            <h1 className="text-5xl font-bold tracking-tight">
              Weather Search ⛅
            </h1>
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
        ) : (
          <div>
            <div className="h-min w-96 mt-4">
              <Command>
                <CommandInput
                  value={input}
                  onValueChange={setInput}
                  onSubmit
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

            {weather ? (
              <div className="text-center mt-24 flex items-center flex-col flex-wrap">
                <h1 className="text-3xl">{weather.name}</h1>
                <div className="w-44 h-44 outline-1 flex justify-center items-center flex-col border-zinc-500 border-2 mt-3 rounded-2xl">
                  <h1 className="text-6xl font-bold">
                    {Math.floor(weather.main.temp)}°C
                  </h1>
                  <p>feels like {Math.floor(weather.main.feels_like)}°C</p>
                </div>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border mt-3"
                />
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
