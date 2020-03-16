/////////////////////TEMPERATURE/////////////////////
var ctx = document.getElementById('myChart_temperature').getContext('2d');
var myChart_temperature = new Chart(ctx, {

  type: 'line',

  data: {

    datasets: [{
      label: "Temperature",
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgb(255, 99, 132)',
      fill: true,
      lineTension: 0,
      pointBackgroundColor: 'rgb(255, 66, 132)',
      pointBorderColor: 'rgb(255, 66, 132)',
      borderCapStyle: 'round',
      data: []

    }]

  },

  options: {

    scales: {

      xAxes: [{

        type: 'realtime',
        realtime: { // per-axis options
          duration: 30000, // data in the past 20000 ms will be displayed
          refresh: 1000, // onRefresh callback will be called every 1000 ms
          delay: 0, // delay of 1000 ms, so upcoming values are known before plotting a line
          pause: false, // chart is not paused
          ttl: 40000,
          frameRate: 40
        }

      }],
      yAxes: [{

        label: 'temp'

      }]
    }

  }

});
////////////////////TEMPERATURE////////////////////

/////////////////////HUMIDITY/////////////////////
var ctx = document.getElementById('myChart_humidity').getContext('2d');
var myChart_humidity = new Chart(ctx, {

  type: 'line',

  data: {

    datasets: [{
      label: "Humidity",
      backgroundColor: 'rgb(54, 162, 235)',
      borderColor: 'rgb(54, 162, 235)',
      fill: true,
      lineTension: 0,
      pointBackgroundColor: 'rgb(54, 90, 235)',
      pointBorderColor: 'rgb(54, 90, 235)',
      borderCapStyle: 'round',
      data: []

    }]

  },

  options: {

    scales: {

      xAxes: [{

        type: 'realtime',
        realtime: { // per-axis options
          duration: 30000, // data in the past 20000 ms will be displayed
          refresh: 1000, // onRefresh callback will be called every 1000 ms
          delay: 0, // delay of 1000 ms, so upcoming values are known before plotting a line
          pause: false, // chart is not paused
          ttl: 40000,
          frameRate: 40
        }

      }],
      yAxes: [{

        label: 'hum'

      }]
    }

  }

});

/////////////////////HUMIDITY/////////////////////

/////////////////////PRESSURE/////////////////////
var ctx = document.getElementById('myChart_pressure').getContext('2d');
var myChart_pressure = new Chart(ctx, {

  type: 'line',

  data: {

    datasets: [{
      label: "Pressure",
      backgroundColor: 'rgb(153, 102, 255)',
      borderColor: 'rgb(153, 102, 255)',
      fill: true,
      lineTension: 0,
      pointBackgroundColor: 'rgb(153, 50, 255)',
      pointBorderColor: 'rgb(153, 50, 255)',
      borderCapStyle: 'round',
      data: []

    }]

  },

  options: {

    scales: {

      xAxes: [{

        type: 'realtime',
        realtime: { // per-axis options
          duration: 30000, // data in the past 20000 ms will be displayed
          refresh: 1000, // onRefresh callback will be called every 1000 ms
          delay: 0, // delay of 1000 ms, so upcoming values are known before plotting a line
          pause: false, // chart is not paused
          ttl: 40000,
          frameRate: 40
        }

      }],
      yAxes: [{

        label: 'pressure'

      }]
    }

  }

});
/////////////////////PRESSURE/////////////////////

///////////////////////CO2////////////////////////
var ctx = document.getElementById('myChart_co2').getContext('2d');
var myChart_co2 = new Chart(ctx, {

  type: 'line',

  data: {

    datasets: [{
      label: "CO2",
      backgroundColor: 'rgb(75, 192, 192)',
      borderColor: 'rgb(75, 192, 192)',
      fill: true,
      lineTension: 0,
      pointBackgroundColor: 'rgb(55, 160, 192)',
      pointBorderColor: 'rgb(55, 160, 192)',
      borderCapStyle: 'round',
      data: []

    }]

  },

  options: {

    scales: {

      xAxes: [{

        type: 'realtime',
        realtime: { // per-axis options
          duration: 30000, // data in the past 20000 ms will be displayed
          refresh: 1000, // onRefresh callback will be called every 1000 ms
          delay: 0, // delay of 1000 ms, so upcoming values are known before plotting a line
          pause: false, // chart is not paused
          ttl: 40000,
          frameRate: 40
        }

      }],
      yAxes: [{

        label: 'co2'

      }]
    }

  }

});
///////////////////////CO2////////////////////////

//////////////////////TVOC////////////////////////
var ctx = document.getElementById('myChart_tvoc').getContext('2d');
var myChart_tvoc = new Chart(ctx, {

  type: 'line',

  data: {

    datasets: [{
      label: "TVOC",
      backgroundColor: 'rgb(255, 205, 86)',
      borderColor: 'rgb(255, 205, 86)',
      fill: true,
      lineTension: 0,
      pointBackgroundColor: 'rgb(255, 205, 20)',
      pointBorderColor: 'rgb(255, 205, 20)',
      borderCapStyle: 'round',
      data: []

    }]

  },

  options: {

    scales: {

      xAxes: [{

        type: 'realtime',
        realtime: { // per-axis options
          duration: 30000, // data in the past 20000 ms will be displayed
          refresh: 1000, // onRefresh callback will be called every 1000 ms
          delay: 0, // delay of 1000 ms, so upcoming values are known before plotting a line
          pause: false, // chart is not paused
          ttl: 40000,
          frameRate: 40
        }

      }],
      yAxes: [{

        label: 'tvoc'

      }]
    }

  }

});
//////////////////////TVOC////////////////////////


window.client = new Paho.MQTT.Client("YOUR_RASPBERRY_PI_IP", Number(YOUR_WS_PORT_AS_NUMER_WITHOUT_QUOTES_LIKE_9001), "/ws", "clientId");

function onConnect() {
  console.log("Connected!");
  client.subscribe("esp32/sensors");
  console.log("topic!");
}

// Connect the client, providing an onConnect callback
client.connect({
  onSuccess: onConnect
});

window.client.onMessageArrived = function(message) {
  //function onReceive(event) {
  var IS_JSON = true;
  try {
    window.json = $.parseJSON(message.payloadString)
  } catch (err) {
    IS_JSON = false
  }
  console.log(json);
  ////TEMPERATURE////
  myChart_temperature.data.datasets[0].data.push({
    x: new Date(),
    y: json["temp"]
  });
  ////HUMIDITY////
  myChart_humidity.data.datasets[0].data.push({
    x: new Date(),
    y: json["humidity"]
  });
  ////PRESSURE////
  myChart_pressure.data.datasets[0].data.push({
    x: new Date(),
    y: json["pressure"]
  });
  ////CO2////
  myChart_co2.data.datasets[0].data.push({
    x: new Date(),
    y: json["co2"]
  });
  ////TVOC////
  myChart_tvoc.data.datasets[0].data.push({
    x: new Date(),
    y: json["tvoc"]
  });
  ////TEMPERATURE////
  myChart_temperature.update({
    preservation: true
  });
  ////HUMIDITY////
  myChart_humidity.update({
    preservation: true
  });
  ////PRESSURE////
  myChart_pressure.update({
    preservation: true
  });
  ////CO2////
  myChart_co2.update({
    preservation: true
  });
  ////TVOC////
  myChart_tvoc.update({
    preservation: true
  });
}
