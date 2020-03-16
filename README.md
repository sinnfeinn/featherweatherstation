# featherweatherstation
A weather station with a Raspberry Pi hosted dashboard using:

Hardware:
- SparkFun Thing Plus - ESP32 WROOM (https://www.sparkfun.com/products/14689)
- SparkFun Environmental Combo Breakout - CCS811/BME280 (Qwiic) (https://www.sparkfun.com/products/14348)

Backend:
- mosquitto broker (https://mosquitto.org/)
  -- Set up with websocket support enabled: https://www.element14.com/community/community/design-challenges/sci-fi-your-pi/blog/2015/06/22/pizzapi-mosquitto-websockets-success-tutorial 
- node (https://nodejs.org/en/) 
- expressjs (https://expressjs.com/)
- lowdb (https://github.com/typicode/lowdb)
  -- Creates db.json from received sensordata (https://rike.dev/2019/02/11/hardware-sensors-receiver-raspberry-pi-for-a-basic-tracking-tool-on-temperature-and-humidity/)
- pm2 (https://pm2.keymetrics.io/) daemon process manager


Frontend:
- Chart.js (https://www.chartjs.org/)
- Chart.js Plugin Streaming (https://github.com/nagix/chartjs-plugin-streaming)
- Bootstrap (https://getbootstrap.com/)
- PAHO MQTT (https://github.com/eclipse/paho.mqtt.javascript)
- Dynatable (https://www.dynatable.com/)
- Optional external data from https://darksky.net/dev

![dashboard](https://user-images.githubusercontent.com/936824/76774954-e33aed80-6761-11ea-8735-f0da5898902e.png)

Setup:
ESP32 sends CCS811/BME280 sensordata via ArduinoJson and PubSubClient to Raspberry Pi MQTT broker.
Raspberry Pi uses node/express.js to subscribe to mqtt stream and save data to lowdb as db.json.
Website hosted on RaspberryPi apache server receives chart data via paho mqtt and plots it, dynatable receives db.json via ajax.


Credits:
Rui Santos
- https://github.com/RuiSantosdotme/Cloud-Weather-Station-ESP32-ESP8266/
- https://randomnerdtutorials.com/cloud-weather-station-esp32-esp8266/

rike.dev
- https://rike.dev/2019/02/11/hardware-sensors-receiver-raspberry-pi-for-a-basic-tracking-tool-on-temperature-and-humidity/
