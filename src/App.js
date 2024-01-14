import React, { useState, useEffect } from 'react';
import mqtt from 'mqtt';
import './App.css';

function App() {
  const [temperature, setTemperature] = useState(Math.random() * 30);
  const [alertVisible, setAlertVisible] = useState(false);

  useEffect(() => {
    const subscriberClient = mqtt.connect('wss://test.mosquitto.org:8081/mqtt');

    subscriberClient.on('connect', () => {
      console.log('Subscriber connected');
      subscriberClient.subscribe('Temp');
    });

    subscriberClient.on('message', (topic, message) => {
      if (topic === 'Temp') {
        const tempValue = parseFloat(message.toString());
        setTemperature(tempValue);
        setAlertVisible(tempValue > 25);
        console.log('Received new temperature:', tempValue);
      }
    });

    subscriberClient.on('error', (err) => {
      console.error('Subscriber error:', err);
    });

    subscriberClient.on('close', () => {
      console.log('Subscriber disconnected');
    });

    return () => {
      subscriberClient.end();
    };
  }, []);

  useEffect(() => {
    const publisherClient = mqtt.connect('wss://test.mosquitto.org:8081/mqtt');
    let intervalId;

    publisherClient.on('connect', () => {
      console.log('Publisher connected');

      const publishTemperature = () => {
        const tempValue = Math.random() * 30;
        publisherClient.publish('Temp', tempValue.toString());
        console.log('Published new temperature:', tempValue);
      };

      intervalId = setInterval(publishTemperature, 5000);

      publisherClient.on('close', () => {
        clearInterval(intervalId);
      });
    });

    publisherClient.on('error', (err) => {
      console.error('Publisher error:', err);
    });

    return () => {
      clearInterval(intervalId);
      publisherClient.end();
    };
  }, []);

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6 mt-5">
          <div className="card">
            <div className="card-body text-center">
              <h1 className="mb-4">Temperature Monitor</h1>
              <p className={`temperature-value ${alertVisible ? 'high-temperature' : ''}`}>
                Current Temperature: {temperature.toFixed(2)} °C
              </p>
              {alertVisible && (
                <div className="alert alert-danger mt-3">High Temperature Alert!</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
