export function generateImageUrl(weather: any) {
  const number = weather.current.temp_c;

  // Chart configuration
  const chartConfig = {
    type: "doughnut",
    data: {
      datasets: [{
        data: [weather.location.name + ": " + number + "°C"],
        backgroundColor: ["transparent"],
        borderColor: ["transparent"],
      }],
    },
    options: {
      plugins: {
        datalabels: {
          display: true,
          formatter: function () {
            return number.toString();
          },
          color: "#FFFFFF",
          font: {
            size: 48,
          },
        },
      },
    },
  };

  // QuickChart API URL
  return "https://quickchart.io/chart?c=" +
    encodeURIComponent(JSON.stringify(chartConfig));
}
