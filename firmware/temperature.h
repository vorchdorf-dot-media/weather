/*
  Data structure file for Weather Client

  created 21 Oct 2020
  by Sascha Zarhuber

  This software is licensed under the MIT License.
  https://saschazar.mit-license.org

  https://github.com/vorchdorf-dot-media/weather
*/

/* Data structure for holding measured weather data,
 * will be used for transmitting data to API and
 * storing them on the SD card (when available)
 */
typedef struct WeatherData
{
  /* current timestamp in seconds since 01-01-1970 (UNIX timestamp) */
  unsigned long timestamp;

  /* calculated hash of current data */
  const char *hash;

  /* token for authenticating on remote API service */
  const char *token;

  /* temperature data taken from DS18B20 sensor */
  float temperature;

  /* temperature data taken from DHT11 sensor */
  float temperature2;

  /* humidity data taken from DHT11 sensor */
  float humidity;

  /* current heat index calculated from DHT11 temperature & humidity */
  float feels;

} WeatherData;