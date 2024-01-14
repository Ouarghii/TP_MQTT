const mqtt = require('mqtt');
const client = mqtt.connect('wss://broker.hivemq.com:8000/mqtt'); // Use wss for secure WebSocket

client.on('connect', () => {
  console.log('Publisher connected');

  let intervalId;

  const publishTemperature = () => {
    const temperature = Math.random() * 30; // Simulate temperature values
    client.publish('Temp', temperature.toString());
    console.log('Published new temperature:', temperature);
  };

  intervalId = setInterval(publishTemperature, 5000); // Publish every 5 seconds

  // Clear the interval when the client disconnects
  client.on('close', () => {
    clearInterval(intervalId);
  });
});
