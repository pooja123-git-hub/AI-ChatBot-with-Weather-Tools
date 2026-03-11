interface WeatherCardProps {
    data:WeatherData;
}
interface WeatherData {
    location:string;
    temperature:number;
    conditions:string;
    humidity:number;
}
export default function WeatherCard({data}:WeatherCardProps){
    const getWeatherIcon=(condition:string)=>{
        switch(condition){
            case "sunny":
                return "☀️";
            case "cloudy":  
            return "☁️";
            case "rainy":
                return "🌧️";
            default:
               return "⛅";
        }
    }
  return (
  <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg p-4 text-white shadow-lg">
    
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-lg font-semibold">{data?.location}</h3>
      <span className="text-4xl">{getWeatherIcon(data?.conditions)}</span>
    </div>

    <div className="flex items-baseline gap-2 mb-2">
      <span className="text-5xl font-bold">{data?.temperature}°</span>
      <span className="text-xl opacity-90">F</span>
    </div>

    <div className="text-sm opacity-90 capitalize mb-3">
      {data?.conditions}
    </div>

    <div className="flex items-center gap-2 text-sm opacity-90">
      <span>💧 Humidity:</span>
      <span className="font-semibold">{data?.humidity}%</span>
    </div>

  </div>
);
}