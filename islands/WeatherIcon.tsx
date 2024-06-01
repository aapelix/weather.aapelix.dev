export default function WeatherIcon(
  props: { weatherDescription: string; isDay: string; size: string },
) {
  const icon = props.weatherDescription;
  const is_day = props.isDay;
  const size = props.size;

  const weatherToSvg = {
    "clear": ["Clear", "Clear "],
    "cloudy": ["Partly cloudy", "Cloudy", "Overcast"],
    "fog": ["Mist", "Fog", "Freezing fog"],
    "hazy_clouds": [],
    "hazy_sunshine": [],
    "partly_cloudy": ["Partly cloudy"],
    "partly_sunny": [
      "Patchy light rain",
      "Patchy light snow",
      "Patchy light snow with thunder",
    ],
    "rain": [
      "Patchy rain possible",
      "Light rain",
      "Moderate rain at times",
      "Moderate rain",
      "Heavy rain at times",
      "Heavy rain",
      "Light freezing rain",
      "Moderate or heavy freezing rain",
      "Light rain shower",
      "Moderate or heavy rain shower",
      "Torrential rain shower",
      "Patchy light rain with thunder",
      "Moderate or heavy rain with thunder",
    ],
    "snow": [
      "Patchy snow possible",
      "Patchy sleet possible",
      "Patchy freezing drizzle possible",
      "Blowing snow",
      "Blizzard",
      "Patchy light snow",
      "Light snow",
      "Patchy moderate snow",
      "Moderate snow",
      "Patchy heavy snow",
      "Heavy snow",
      "Ice pellets",
      "Light sleet",
      "Moderate or heavy sleet",
      "Light snow showers",
      "Moderate or heavy snow showers",
      "Light showers of ice pellets",
      "Moderate or heavy showers of ice pellets",
      "Moderate or heavy snow with thunder",
    ],
    "sunny": ["Sunny"],
    "thunderstorm": [
      "Thundery outbreaks possible",
      "Moderate or heavy snow with thunder",
    ],
  };

  const defaultConditions = ["cloudy", "fog", "rain", "snow", "thunderstorm"];

  const findCategory = (
    searchString: string,
    data: Record<string, string[]>,
  ) => {
    for (const category in data) {
      if (data[category].includes(searchString)) {
        return category;
      }
    }
    return "sunny";
  };

  const findDay = (category: string) => {
    if (category == "sunny" && is_day == "night") return "day";
    return defaultConditions.includes(findCategory(icon, weatherToSvg))
      ? "basic"
      : is_day;
  };

  const src = `/icons/${findDay(findCategory(icon, weatherToSvg))}/${
    findCategory(icon, weatherToSvg)
  }.svg`;

  return (
    <img
      src={src}
      alt="Logo"
      class="mx-auto my-3 aspect-square invert brightness-0"
      style={{
        width: size,
      }}
    />
  );
}
