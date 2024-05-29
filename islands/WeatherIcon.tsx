export default function WeatherIcon(
  props: { icon: string; is_day: number; size: string },
) {
  const icon = props.icon;
  const is_day = props.is_day == 1 ? "day" : "night";
  const size = props.size;

  return (
    <img
      src={"/icons/" + is_day + "/" + icon + ".svg"}
      alt="Logo"
      class="mx-auto aspect-square"
      style={{
        width: size,
      }}
    />
  );
}
