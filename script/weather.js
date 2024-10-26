const WeatherJS = require("weather-js");

async function getWeather(location) {
  return new Promise((resolve, reject) => {
    WeatherJS.find(
      {
        search: location,
        degreeType: "C",
      },
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
}

module.exports.config = {
  name: "weather",
  version: "1.0",
  role: 0,
  hasPrefix: false,
  description: "Retrieves the weather information for the specified city.",
  usage: "weather [city]",
  credits: "shiki"
};

module.exports.run = async function ({ api, event, args }) {
  const location = args.join(" ");

  if (args.length > 0 && args[0] === "-help") {
    const usage = "Usage: weather [city]\n\n" +
      "Description: Retrieves the weather information for the specified city.\n\n" +
      "Example: weather London\n\n" +
      "Note: The temperature is displayed in Celsius, and the forecast is for the next 5 days.";
    api.sendMessage(usage, event.threadID);
    return;
  }

  if (!location) {
    const usage = "Please provide a city or location name. Type 'weather -help' for more information.";
    api.sendMessage(usage, event.threadID);
    return;
  }

  try {
    const result = await getWeather(location);

    if (result.length === 0) {
      api.sendMessage(`No results found for "${location}". Please enter a valid city or location name.`, event.threadID);
      return;
    }

    const weatherData = result[0];
    const message = `Weather for ${weatherData.location.name} (${weatherData.location.lat}, ${weatherData.location.long}):\n\n` +
      `Temperature: ${weatherData.current.temperature}°C / ${(weatherData.current.temperature * 9) / 5 + 32}°F\n` +
      `Sky: ${weatherData.current.skytext}\n` +
      `Feels like: ${weatherData.current.feelslike}\n` +
      `Humidity: ${weatherData.current.humidity}\n` +
      `Wind Speed: ${weatherData.current.winddisplay}\n\n` +
      `Forecast\n` +
      `Mon: ${weatherData.forecast[0].skytextday}\n` +
      `Tue: ${weatherData.forecast[1].skytextday}\n` +
      `Wed: ${weatherData.forecast[2].skytextday}\n` +
      `Thu: ${weatherData.forecast[3].skytextday}\n` +
      `Fri: ${weatherData.forecast[4].skytextday}\n`;

    api.sendMessage(message, event.threadID);
  } catch (error) {
    console.error(error);
    api.sendMessage("An error occurred while fetching the weather data.", event.threadID);
  }
};
