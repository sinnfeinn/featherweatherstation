const express = require('express');
const app = express();

app.get('/', function (req, res) {
 res.send('database here!');
});
app.listen(3000, () => console.log('App listening on port ', 3000))

var moment = require('moment-timezone');

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('/var/www/html/db.json');
const db = low(adapter);

db.defaults({ records: [] })
 .write()

const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://localhost:1883');

client.subscribe('esp32/#');
//client.subscribe('esp32/humidity');

client.on('message', function (topic, message) {

//console.log(parseFloat(message));
  // message is Buffer
  data = JSON.parse(message);

var stringBuf = message && message.toString('utf-8')
   var json = JSON.parse(stringBuf);
//console.log(stringBuf);

     //do database update or print
       const time = moment.tz("America/Los_Angeles");
       const formattedTime = time.format('YYYY-MM-DD HH:mm:ss');
       console.log('write post');
       db.get('records')
       .push({ id: "CCS811/BME280", room: "Livingroom", temp: json.temp, hum: json.humidity, press: json.pressure,  co2: json.co2, tvoc: json.t$
 })
