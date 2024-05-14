import {
  Sun,
  Cloud,
  CloudSun,
  Cloudy,
  CloudRainWind,
  CloudSunRain,
  CloudLightning,
  Snowflake,
  CloudFog,
  Moon,
  CloudMoon,
  CloudMoonRain,
} from "lucide-react";

export default function WeatherIconSmall(icon: any) {
  return (
    <>
      {icon.icon == "01d" ? <Sun className="h-12 w-12" /> : null}
      {icon.icon == "02d" ? <CloudSun className="h-12 w-12" /> : null}
      {icon.icon == "03d" ? <Cloud className="h-12 w-12" /> : null}
      {icon.icon == "04d" ? <Cloudy className="h-12 w-12" /> : null}
      {icon.icon == "09d" ? <CloudRainWind className="h-12 w-12" /> : null}
      {icon.icon == "10d" ? <CloudSunRain className="h-12 w-12" /> : null}
      {icon.icon == "11d" ? <CloudLightning className="h-12 w-12" /> : null}
      {icon.icon == "13d" ? <Snowflake className="h-12 w-12" /> : null}
      {icon.icon == "50d" ? <CloudFog className="h-12 w-12" /> : null}

      {icon.icon == "01n" ? <Moon className="h-12 w-12" /> : null}
      {icon.icon == "02n" ? <CloudMoon className="h-12 w-12" /> : null}
      {icon.icon == "03n" ? <Cloud className="h-12 w-12" /> : null}
      {icon.icon == "04n" ? <Cloudy className="h-12 w-12" /> : null}
      {icon.icon == "09n" ? <CloudRainWind className="h-12 w-12" /> : null}
      {icon.icon == "10n" ? <CloudMoonRain className="h-12 w-12" /> : null}
      {icon.icon == "11n" ? <CloudLightning className="h-12 w-12" /> : null}
      {icon.icon == "13n" ? <Snowflake className="h-12 w-12" /> : null}
      {icon.icon == "50n" ? <CloudFog className="h-12 w-12" /> : null}
    </>
  );
}
