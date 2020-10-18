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
#include <WiFiUdp.h>

// Basic setup:
// ------------
// REQUIRES the following Arduino libraries:
// - NTPClient Library: https://github.com/arduino-libraries/NTPClient
#include <NTPClient.h>

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
-------------------------------------------------------------------------------
---------------------------- CONFIG SECTION BELOW -----------------------------
-------------------------- ADJUST TO FIT YOUR SETUP ---------------------------
-------------------------------------------------------------------------------
*/
#define SERIAL_BAUDRATE 115200
#define INTERVAL 30 // interval in minutes

/* change LED pin to custom pin, if desired  */
#define LED LED_BUILTIN

/* WIFI setup */
//#define OFFLINE                   // uncomment to not use WiFi at all
//#define STATIC_IP                 // uncomment to use static IP config (see below)
#define WIFI_SSID ""              // your wifi SSID
#define WIFI_PASSWORD ""          // your wifi password
#define NTP_SERVER "pool.ntp.org" // NTP pool for correct time

#ifdef STATIC_IP
/* WiFi config to use static IP */
IPAddress localIP(192, 168, 1, 251);
IPAddress gateway(192, 168, 1, 1);
IPAddress subnet(255, 255, 255, 0);
IPAddress dns1(1, 1, 1, 1);
IPAddress dns2(1, 0, 0, 1);
#endif

#define API_HOST ""  // API host to send POST request to, e.g. jsonplaceholder.typicode.com
#define API_PATH ""  // path of the API host, e.g. /api
#define API_PORT 443 // HTTPS port of the API service

/* uncomment to enable DS18B20 */
//#define DS18B20 D2  // DS18B20 data PIN

/* uncomment to enable DHT11 */
//#define DHTPIN D1 // DHT11 data PIN
//#define DHTTYPE DHT11

/*
-------------------------------------------------------------------------------
----------------------------------- WARNING! ----------------------------------
-------------------------------------------------------------------------------
------------------------------ SOURCE CODE BELOW ------------------------------
----------------------------- CHANGE AT OWN RISK! -----------------------------
-------------------------------------------------------------------------------
*/

#ifdef DS18B20
OneWire oneWire(DS18B20);
DallasTemperature sensor(&oneWire);
#endif

#ifdef DHTPIN
DHT_Unified dht(DHTPIN, DHTTYPE);
#endif

#ifndef OFFLINE
/* WiFi & NTP setup configuration */
const char *ssid = WIFI_SSID;
const char *pass = WIFI_PASSWORD;
const char *ntpServer = NTP_SERVER;
WiFiUDP udpClient;
NTPClient ntpClient(udpClient, ntpServer);
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
      delay(500);
      Serial.print(".");
    }

    Serial.println("");
    Serial.println("Connected!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
  }
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
}

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
  Serial.printf("Current UTC time is: %ih %imin %is\n", h, m, s); // print current UTC time

  unsigned long i = INTERVAL * 60 * 1000;            // calculate INTERVAL in minutes
  unsigned long gap = i - ((m * 60 + s) * 1000) % i; // calculate delay until next interval start
  Serial.printf("Next cycle starts in %ld seconds.\n", (unsigned long)gap / 1000);
  return gap;
#else
  Serial.println("Device is in OFFLINE mode! Cannot send data to remote server!");
  return INTERVAL * 60 * 1000;
#endif
}

#ifndef OFFLINE
// TODO: check function parameters
void request()
{
  const char *host = API_HOST;
  const char *path = API_PATH;
  WiFiClientSecure client;

  client.setInsecure();     // Need to do this, because SSL certificates can't be auto-updated...
  client.setTimeout(15000); // set timeout of 15 seconds
  delay(500);

  Serial.printf("Connecting to API endpoint: %s\n", host);
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

  // TODO: enhance body
  unsigned int len = 0;
  String body = "";

  String req = "POST " + API_PATH + " HTTP/1.1\r\n" +
               "Host: " + API_HOST + "\r\n" +
               "User-Agent: Arduino Weather Client - " + (const char *)__VERSION__ + "\r\n" +
               "Content-Type: application/json; charset=UTF-8\r\n" +
               "Content-Length: " + len + "\r\n\r\n" +
               body + "\r\n" +
               "Connection: close\r\n\r\n";

  client.print(req);

  Serial.println("Request sent.\n\n-----------------\n\n");
  while (client.connected())
  {
    String line = client.readStringUntil("\n");
    if (line == "\r")
    {
      break;
    }
    Serial.println(line);
  }
  while (client.available())
  {
    String line = client.readStringUntil("\n");
    Serial.println(line);
  }
  Serial.println("\n-----------------\n\n");
}
#endif

// the loop function runs over and over again forever
void loop()
{
#ifndef OFFLINE
  connect();
#endif

  delay(interval());

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

#ifndef OFFLINE
  connect();
  request();
#endif
}
