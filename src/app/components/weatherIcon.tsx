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
} from "lucide-react";

export default function WeatherIcon(icon: any) {
  return (
    <>
      {icon.icon == "01d" ? <Sun className="w-36 h-36" /> : null}
      {icon.icon == "02d" ? <CloudSun className="w-36 h-36" /> : null}
      {icon.icon == "03d" ? <Cloud className="w-36 h-36" /> : null}
      {icon.icon == "04d" ? <Cloudy className="w-36 h-36" /> : null}
      {icon.icon == "09d" ? <CloudRainWind className="w-36 h-36" /> : null}
      {icon.icon == "10d" ? <CloudSunRain className="w-36 h-36" /> : null}
      {icon.icon == "11d" ? <CloudLightning className="w-36 h-36" /> : null}
      {icon.icon == "13d" ? <Snowflake className="w-36 h-36" /> : null}
      {icon.icon == "50d" ? <CloudFog className="w-36 h-36" /> : null}
    </>
  );
}
