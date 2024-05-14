import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import WeatherIconSmall from "./weatherIconSmall";

export default function ForeCastItem(data: any) {
  const forecast = data.data;

  return (
    <div>
      <p className="text-xs">
        {forecast.dt_txt.slice(8, 10)}.{forecast.dt_txt.slice(5, 7)}
      </p>
      <h1 className="font-black">{forecast.dt_txt.slice(11, 16)}</h1>
      <div className="flex items-center justify-center md:translate-x-1 translate-x-[0.3rem] mt-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="w-12 h-12 border-[1px] border-zinc-700 rounded-md mr-3 flex justify-center items-center flex-col p-1">
                <WeatherIconSmall icon={forecast.weather[0].icon} />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{forecast.weather[0].description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <p className="mt-2">{Math.floor(forecast.main.temp)}°C</p>
      <div className="md:translate-x-[1.30rem] translate-x-4">
        <img
          src="/arrow2.png"
          className="w-12 h-12"
          style={{
            transform: `rotate(${360 - forecast.wind.deg}deg)`,
          }}
          alt=""
        />
      </div>
    </div>
  );
}
