/*
  Weather Client

  Reads temperature, humidity & pressure from DS18B20 and DHT11 sensors. Then uploads values to web service via WiFi.

  This sketch requires the following parts:

  - ESP8266 NodeMcu compatible board (I use the D1 Mini)
  - DS18B20 OneWire temperature sensor
  - DHT11 temperature, humidity & pressure sensor
  - 2x 4.7k resistors (pull-up for DS18B20 and DHT11)

  created 17 Oct 2020
  by Sascha Zarhuber

  This software is licensed under the MIT License.
  https://saschazar.mit-license.org

  https://github.com/vorchdorf-dot-media/wetter
*/

#include <ESP8266WiFi.h>

// DS18B20:
// --------
// REQUIRES the following Arduino libraries:
// - OneWire Library: https://github.com/PaulStoffregen/OneWire
// - DallasTemperature Library: https://github.com/milesburton/Arduino-Temperature-Control-Library
#include <OneWire.h>
#include <DallasTemperature.h>

// DHT11:
// --------
// REQUIRES the following Arduino libraries:
// - DHT Sensor Library: https://github.com/adafruit/DHT-sensor-library
// - Adafruit Unified Sensor Lib: https://github.com/adafruit/Adafruit_Sensor
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>

/*
-----------------------------------
------ config section below -------
---- adjust to fit your setup -----
-----------------------------------
*/
#define SERIAL_BAUDRATE 115200

/* WIFI setup */
#define WIFI_SSID ""     // your wifi SSID
#define WIFI_PASSWORD "" // your wifi password

/* uncomment to enable DS18B20 */
//#define DS18B20 D2  // DS18B20 data PIN

/* uncomment to enable DHT11 */
//#define DHTPIN D1 // DHT11 data PIN
//#define DHTTYPE DHT11

/*
-----------------------------------
------------- WARNING! ------------
-----------------------------------
-------- source code below --------
------- change at own risk! -------
-----------------------------------
*/

#ifdef DS18B20
OneWire oneWire(DS18B20);
DallasTemperature sensor(&oneWire);
#endif

#ifdef DHTPIN
DHT_Unified dht(DHTPIN, DHTTYPE);
#endif

// the setup function runs once when you press reset or power the board
void setup()
{
  Serial.begin(SERIAL_BAUDRATE);
  Serial.println("Booting up Arduino weather client...");
}

// the loop function runs over and over again forever
void loop()
{
  Serial.println("Requesting temperature...");

#ifdef DS18B20
  unsigned long t = millis();
  sensor.requestTemperatures();
  unsigned long tt = millis() - t;
  Serial.print("DS18B20 done! Request lasted ");
  Serial.print(tt);
  Serial.println(" ms.");

  Serial.print("Temperature is: ");
  Serial.println(sensor.getTempCByIndex(0));
#else
  Serial.println("No DS18B20 PIN defined. Skipping DS18B20...");
#endif

#ifdef DHTPIN
  sensors_event_t event;
  dht.temperature().getEvent(&event);
  // TODO: initialize DHT11 using dht.begin()
  // read ALL the data
#else
  Serial.println("No DHT11 PIN defined. Skipping DHT11...");
#endif

  delay(2000);
}
