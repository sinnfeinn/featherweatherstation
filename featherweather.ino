#include <WiFi.h>
#include <PubSubClient.h>
#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <SparkFunBME280.h>
#include <SparkFunCCS811.h>
#include <ArduinoJson.h>
#define CCS811_ADDR 0x5B //Default I2C Address

const char* ssid = "YOUR_SSID";
const char* password = "YOUR_PW";

// Add your MQTT Broker IP address, example:
const char* mqtt_server = "YOUR_RASPBERRY_PI_IP";

WiFiClient espClient;
PubSubClient client(espClient);
long lastMsg = 0;
char msg[50];
int value = 0;

//Global sensor objects
CCS811 myCCS811(CCS811_ADDR);

#define SEALEVELPRESSURE_HPA (1013.25)

BME280 bme; // I2C

// LED Pin
const int ledPin = 13;

void setup() {
        Serial.begin(115200);

        Wire.begin(); //Inialize I2C Harware

        //It is recommended to check return status on .begin(), but it is not
        //required.
        CCS811Core::CCS811_Status_e returnCode = myCCS811.beginWithStatus();
        Serial.print("CCS811 begin exited with: ");
        Serial.println(myCCS811.statusString(returnCode));

//Initialize BME280
        //For I2C, enable the following and disable the SPI section
        bme.settings.commInterface = I2C_MODE;
        bme.settings.I2CAddress = 0x77;
        bme.settings.runMode = 3; //Normal mode
        bme.settings.tStandby = 0;
        bme.settings.filter = 4;
        bme.settings.tempOverSample = 5;
        bme.settings.pressOverSample = 5;
        bme.settings.humidOverSample = 5;

        delay(10); //Make sure sensor had enough time to turn on. BME280 requires 2ms to start up.
        byte id = bme.begin(); //Returns ID of 0x60 if successful
        if (id != 0x60)
        {
                Serial.println("Problem with BME280");
                while (1);
        }
        setup_wifi();
        client.setServer(mqtt_server, 1883);
        client.setCallback(callback);

        pinMode(ledPin, OUTPUT);
}

void setup_wifi() {
        delay(10);
        // We start by connecting to a WiFi network
        Serial.println();
        Serial.print("Connecting to ");
        Serial.println(ssid);

        WiFi.begin(ssid, password);

        while (WiFi.status() != WL_CONNECTED) {
                delay(500);
                Serial.print(".");
        }

        Serial.println("");
        Serial.println("WiFi connected");
        Serial.println("IP address: ");
        Serial.println(WiFi.localIP());


}

void callback(char* topic, byte* message, unsigned int length) {
        Serial.print("Message arrived on topic: ");
        Serial.print(topic);
        Serial.print(". Message: ");
        String messageTemp;

        for (int i = 0; i < length; i++) {
                Serial.print((char)message[i]);
                messageTemp += (char)message[i];
        }
        Serial.println();

        // If a message is received on the topic esp32/output, you check if the message is either "on" or "off".
        // Changes the output state according to the message
        if (String(topic) == "esp32/output") {
                Serial.print("Changing output to ");
                if(messageTemp == "on") {
                        Serial.println("on");
                        digitalWrite(ledPin, HIGH);
                }
                else if(messageTemp == "off") {
                        Serial.println("off");
                        digitalWrite(ledPin, LOW);
                }
        }
}

void reconnect() {
        // Loop until we're reconnected
        while (!client.connected()) {
                Serial.print("Attempting MQTT connection...");
                // Attempt to connect
                if (client.connect("ESP8266Client")) {
                        Serial.println("connected");
                        // Subscribe
                        client.subscribe("esp32/output");
                } else {
                        Serial.print("failed, rc=");
                        Serial.print(client.state());
                        Serial.println(" try again in 5 seconds");
                        // Wait 5 seconds before retrying
                        delay(5000);
                }
        }
}
void loop() {

        if (myCCS811.dataAvailable())
        {
                //Calling this function updates the global tVOC and eCO2 variables
                myCCS811.readAlgorithmResults();

                float BMEtempC = bme.readTempC();
                float BMEhumid = bme.readFloatHumidity();

                //This sends the temperature data to the CCS811
                myCCS811.setEnvironmentalData(BMEhumid, BMEtempC);
        }
        else if (myCCS811.checkForStatusError())
        {
                //If the CCS811 found an internal error, print it.
                printSensorError();
        }


        if (!client.connected()) {
                reconnect();
        }
        client.loop();

        long now = millis();
        if (now - lastMsg > 5000) {
                lastMsg = now;

                DynamicJsonDocument doc(200);

                const size_t capacity = JSON_OBJECT_SIZE(5);

                //DynamicJsonDocument doc(capacity);
                doc["temp"] = bme.readTempC();
                doc["humidity"] = bme.readFloatHumidity();
                doc["pressure"] = bme.readFloatPressure()/100.0F;
                doc["co2"] = myCCS811.getCO2();
                doc["tvoc"] = myCCS811.getTVOC();
                char buffer[512];
                size_t n = serializeJson(doc, buffer);
                client.publish("esp32/sensors", buffer, n);
        }
}


//printSensorError gets, clears, then prints the errors
//saved within the error register.
void printSensorError()
{
        uint8_t error = myCCS811.getErrorRegister();

        if (error == 0xFF) //comm error
        {
                Serial.println("Failed to get ERROR_ID register.");
        }
        else
        {
                Serial.print("Error: ");
                if (error & 1 << 5)
                        Serial.print("HeaterSupply");
                if (error & 1 << 4)
                        Serial.print("HeaterFault");
                if (error & 1 << 3)
                        Serial.print("MaxResistance");
                if (error & 1 << 2)
                        Serial.print("MeasModeInvalid");
                if (error & 1 << 1)
                        Serial.print("ReadRegInvalid");
                if (error & 1 << 0)
                        Serial.print("MsgInvalid");
                Serial.println();
        }
}
