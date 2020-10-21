/*
  Data structure file for Weather Client

  created 21 Oct 2020
  by Sascha Zarhuber

  This software is licensed under the MIT License.
  https://saschazar.mit-license.org

  https://github.com/vorchdorf-dot-media/weather
*/

typedef struct WeatherData
{
  const char *hash;
  const char *timestamp;
  const char *token;
  float temperature;
  float temperature2;
  float humidity;
  float feels;
} WeatherData;