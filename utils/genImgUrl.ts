export function generateImageUrl(weather: any) {
  return `https://quickchart.io/chart?c={type:'radialGauge',data:{datasets:[{data:[${weather.current.temp_c}],backgroundColor:'white',textColor:'white'}]}}`;
}
