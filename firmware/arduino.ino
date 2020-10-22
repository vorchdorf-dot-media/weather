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

  https://github.com/vorchdorf-dot-media/weather
*/

/*
-------------------------------------------------------------------------------
---------------------------- CONFIG SECTION BELOW -----------------------------
-------------------------- ADJUST TO FIT YOUR SETUP ---------------------------
-------------------------------------------------------------------------------
*/

#define TOKEN "" // universal identifier for this unit, mandatory!

/* Basic WiFi setup:
 * ------------
 * REQUIRES the following Arduino libraries:
 * - NTPClient Library: https://github.com/arduino-libraries/NTPClient
 */

//#define OFFLINE                   // uncomment to not use WiFi at all
//#define STATIC_IP                 // uncomment to use static IP config (see STATIC_IP config below)
#define WIFI_SSID ""              // your wifi SSID
#define WIFI_PASSWORD ""          // your wifi password
#define NTP_SERVER "pool.ntp.org" // NTP pool for correct time

#define SERIAL_BAUDRATE 115200
#define INTERVAL 30 // interval in minutes

/* change LED pin to custom pin, if desired  */
#define LED LED_BUILTIN

#define API_HOST "postman-echo.com" // API host to send POST request to, e.g. postman-echo.com
#define API_PATH "post"             // path of the API host, without leading /, e.g. api
#define API_PORT 443                // HTTPS port of the API service

/* DS18B20:
 * --------
 * REQUIRES the following Arduino libraries:
 * - OneWire Library: https://github.com/PaulStoffregen/OneWire
 * - DallasTemperature Library: https://github.com/milesburton/Arduino-Temperature-Control-Library
 */
//#define DS18B20 D2 // uncomment to enable DS18B20 data PIN

/* DHT11:
 * --------
 * REQUIRES the following Arduino libraries:
 * - DHT Sensor Library: https://github.com/adafruit/DHT-sensor-library
 * - Adafruit Unified Sensor Lib: https://github.com/adafruit/Adafruit_Sensor
 */
//#define DHTPIN D1 // uncomment to enable DHT11 data PIN
//#define DHTTYPE DHT11

/* SD Card:
 * --------
 * REQUIRES the following Arduino libraries:
 * - SdFat Library: Should be already included (https://github.com/earlephilhower/ESP8266SdFat)
 */
//#define SD_CS_PIN SS

/*
-------------------------------------------------------------------------------
----------------------------------- WARNING! ----------------------------------
-------------------------------------------------------------------------------
------------------------------ SOURCE CODE BELOW ------------------------------
----------------------------- CHANGE AT OWN RISK! -----------------------------
-------------------------------------------------------------------------------
*/
#include "temperature.h"

#ifndef OFFLINE
#include <ESP8266WiFi.h>
#include <Hash.h>
#include <WiFiUdp.h>
#include <NTPClient.h>
#include <base64.h>

#ifdef STATIC_IP
/* WiFi config to use static IP */
IPAddress localIP(192, 168, 1, 251);
IPAddress gateway(192, 168, 1, 1);
IPAddress subnet(255, 255, 255, 0);
IPAddress dns1(1, 1, 1, 1);
IPAddress dns2(1, 0, 0, 1);
#endif

/* WiFi & NTP setup configuration */
const char *ssid = WIFI_SSID;
const char *pass = WIFI_PASSWORD;
const char *ntpServer = NTP_SERVER;
WiFiUDP udpClient;
NTPClient ntpClient(udpClient, ntpServer);
#endif

#ifdef DS18B20
#include <OneWire.h>
#include <DallasTemperature.h>

OneWire oneWire(DS18B20);
DallasTemperature sensor(&oneWire);
#endif

#ifdef DHTPIN
#include <DHT.h>

DHT dht(DHTPIN, DHTTYPE);
#endif

#ifdef SD_CS_PIN
#include <SPI.h>
#include <SdFat.h>

using namespace sdfat;

SdFat SD;
sdfat::File csv;
#endif

#ifndef OFFLINE
/*
 * (Re-) connects WiFi if connection was lost
 * to ensure network availbility when querying
 * for NTP and pushing data to server
*/
void connect()
{
  if (WiFi.status() != WL_CONNECTED)
  {
    WiFi.reconnect();
    while (WiFi.status() != WL_CONNECTED)
    {
      Serial.print(".");
      digitalWrite(LED, HIGH);
      delay(250);
      digitalWrite(LED, LOW);
      delay(250);
    }

    Serial.println("");
    Serial.println("Connected!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
    delay(500);
  }
}
#endif

/*
 * Calculates the delay until next cycle in ms.
 * Uses zero-based minute clock, so that
 * interval is run independent of power cycles.
 * E.g: 15min interval is run at 15, 30, 45 and 0 minutes
 */
unsigned long interval()
{
#ifndef OFFLINE
  ntpClient.update();
  int h = ntpClient.getHours();
  int m = ntpClient.getMinutes();
  int s = ntpClient.getSeconds();
  Serial.printf("Current UTC time is: %02i:%02i:%02i\n", h, m, s); // print current UTC time

  unsigned long i = INTERVAL * 60 * 1000;            // calculate INTERVAL in ms
  unsigned long gap = i - ((m * 60 + s) * 1000) % i; // calculate delay until next cycle start
  Serial.printf("Next cycle starts in %ld seconds.\n", (unsigned long)gap / 1000);
  return gap;
#else
  // if device is in offline mode, just return INTERVAL value in ms
  Serial.println("Device is in OFFLINE mode! Cannot send data to remote server!");
  return INTERVAL * 60 * 1000;
#endif
}

#ifndef OFFLINE
// TODO: check function parameters
void request(WeatherData *weather)
{
  String host = API_HOST;
  String path = API_PATH;
  WiFiClientSecure client;

  client.setInsecure();     // Need to do this, because SSL certificates can't be auto-updated...
  client.setTimeout(15000); // set timeout of 15 seconds
  delay(500);

  // Connect to API_HOST with 30 reconnection tries
  Serial.printf("Connecting to API endpoint: %s\n", host.c_str());
  byte r = 0;
  while (!client.connect(host, API_PORT) && r < 30)
  {
    delay(100);
    Serial.print(".");
    r++;
  }
  Serial.println("");

  if (r == 30)
  {
    Serial.println("Connection FAILED!");
    return;
  }
  else
  {
    Serial.println("Connected!");
  }

  // Client is connected to API_HOST, now form GraphQL Mutation
  String hash(weather->hash);
  String body = "{\"query\": \"mutation createEntry { createEntry(hash: \"" + hash + "\", timestamp: " + weather->timestamp + ", temperature: [" + weather->temperature + ", " + weather->temperature2 + "], humidity: " + weather->humidity + ", feels: " + weather->feels + ") { id } }\"}";
  unsigned int len = body.length();

  // Form Basic authentication string
  String user(weather->token);
  String pass(weather->hash);
  String userpass = user + ":" + pass;
  String encoded = base64::encode((const uint8_t *)userpass.c_str(), userpass.length(), false);

  // Put it all together and form complete POST request
  String req = "POST /" + path + " HTTP/1.1\r\n" +
               "Host: " + host + "\r\n" +
               "Authorization: Basic " + encoded + "\r\n" +
               "User-Agent: Arduino Weather Client - " + (const char *)__VERSION__ + "\r\n" +
               "Content-Type: application/json; charset=UTF-8\r\n" +
               "Content-Length: " + len + "\r\n\r\n" +
               body + "\r\n" +
               "Connection: close\r\n\r\n";

  client.print(req);

  Serial.println("Request sent.\n\n-----------------\n");
  while (client.connected())
  {
    String line = client.readStringUntil('\n');
    if (line == "\r")
    {
      Serial.println("\n-----------------\nHeaders received.\n-----------------\n");
      break;
    }
    Serial.println(line);
  }
  String line = client.readStringUntil('\n');
  Serial.println(line);
  Serial.println("\n-----------------\n");
}
#endif

#ifdef SD_CS_PIN
void writeToSD(WeatherData *weather)
{
  Serial.println("Writing data to SD card...");
  const char *filename = "LOG.CSV";
  if (!SD.exists(filename))
  {
    csv = SD.open(filename, FILE_WRITE);
    if (!csv)
    {
      Serial.println("Failed to write log to SD card!");
      return;
    }
    csv.println("token;timestamp;hash;temperature;temperature2;humidity;feels");
    csv.close();
    delay(500);
  }
  csv = SD.open(filename, FILE_WRITE);
  if (!csv)
  {
    Serial.println("Failed to write log to SD card!");
    return;
  }
  String token(weather->token);
  String hash(weather->hash);
  String dump(token + ";" + weather->timestamp + ";" + hash + ";" + weather->temperature + ";" + weather->temperature2 + ";" + weather->humidity + ";" + weather->feels);
  csv.println(dump.c_str());
  csv.close();
  Serial.println("Succeeded!");
  delay(500);
}
#endif

// the setup function runs once when you press reset or power the board
void setup()
{
  pinMode(LED, OUTPUT);
  Serial.begin(SERIAL_BAUDRATE);
  Serial.println("Booting up Arduino weather client...");

#ifndef OFFLINE
  Serial.print("Connecting to WiFi SSID: ");
  Serial.println(ssid);

#ifdef STATIC_IP
  Serial.println("Use static IP config...");
  WiFi.config(localIP, gateway, subnet, dns1, dns2);
#endif

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, pass);

  connect();

  ntpClient.begin();
  ntpClient.setTimeOffset(0); // set timezone to UTC
#endif

#ifdef DHTPIN
  dht.begin();
#endif

#ifdef SD_CS_PIN
  pinMode(SD_CS_PIN, OUTPUT);
  Serial.print("Initializing SD card...");
  if (!SD.begin(SD_CS_PIN))
  {
    Serial.println("FAILED!");
    while (true)
    {
      digitalWrite(LED, HIGH);
      delay(250);
      digitalWrite(LED, LOW);
      delay(250);
    }
  }
  else
  {
    Serial.println("done!");
  }
#endif
}

// the loop function runs over and over again forever
void loop()
{
  digitalWrite(LED, LOW);

  String hashbase(TOKEN);
  unsigned long t = 0;
  /* Initialize variables for temperature & humidity
   * with invalid values, for checking whether a measured
   * value is present later on.
   * -274°C is invalid, as it's below 0K,
   * -1.0% humidity is also invalid.
   */
  WeatherData weather;
  weather.token = hashbase.c_str();
  weather.temperature = -274.0;
  weather.temperature2 = -274.0;
  weather.feels = -274.0;
  weather.humidity = -1.0;

#ifndef OFFLINE
  connect();
#endif
  delay(interval());
  digitalWrite(LED, HIGH);
  Serial.println("Requesting temperature...");

#ifdef DS18B20
  t = millis();
  sensor.requestTemperatures();
  Serial.printf("DS18B20 done! Request lasted %i ms.\n", millis() - t);

  weather.temperature = sensor.getTempCByIndex(0);
  Serial.printf("Temperature is: %6.2f°C\n", weather.temperature);
  hashbase += weather.temperature;
#else
  Serial.println("No DS18B20 PIN defined. Skipping DS18B20...");
#endif

#ifdef DHTPIN
  t = millis();
  weather.humidity = dht.readHumidity();
  weather.temperature2 = dht.readTemperature();
  weather.feels = dht.computeHeatIndex(weather.temperature2, weather.humidity, false);
  Serial.printf("DHT done! Request lasted %i ms.\n", millis() - t);

  Serial.printf("Temperature is: %6.2f°C (feels like %6.2f°C)\n", weather.temperature2, weather.feels);
  Serial.printf("Humidity is: %6.2f%%\n", weather.humidity);
  hashbase += weather.humidity;
  hashbase += weather.temperature2;
  hashbase += weather.feels;
#else
  Serial.println("No DHT11 PIN defined. Skipping DHT11...");
#endif

#ifndef OFFLINE
  connect();
  weather.timestamp = ntpClient.getEpochTime();
  hashbase += weather.timestamp;
#endif

  weather.hash = sha1(hashbase).c_str();
  Serial.printf("SHA1 identifier for this cycle: %s\n", weather.hash);

#ifndef OFFLINE
  request(&weather);
#endif

#ifdef SD_CS_PIN
  writeToSD(&weather);
#endif
}
