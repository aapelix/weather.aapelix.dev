"use client";

import { ModeToggle } from "@/components/theme-toggle";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useEffect, useState } from "react";

export default function Home() {
  const apiKey = process.env.WEATHER_API_KEY;
  const [searched, setSearched] = useState(false);
  const [input, setInput] = useState("");

  useEffect(() => {
    console.log(apiKey);
  });

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

                <CommandList>
                  {input !== "" && input !== undefined ? (
                    <>
                      <CommandEmpty>No results found.</CommandEmpty>

                      <CommandGroup heading="Results">
                        <CommandItem>Calendar</CommandItem>
                        <CommandItem>Search Emoji</CommandItem>
                        <CommandItem>Calculator</CommandItem>
                      </CommandGroup>
                    </>
                  ) : null}
                </CommandList>
              </Command>
            </div>
          </div>
        ) : (
          <div>
            <h1>You propably searched something?</h1>
          </div>
        )}
      </div>
    </main>
  );
}
