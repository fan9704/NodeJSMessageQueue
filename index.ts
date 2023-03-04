import express from 'express';
import mqtt from 'mqtt';
import * as dotenv from "dotenv";

dotenv.config();

if (!process.env.PORT) {
    process.exit(1);
 }

const PORT: number = parseInt(process.env.PORT as string, 10);



const app = express();
const mqttClient = mqtt.connect("mqtt://140.125.207.230:1883");//'mqtt://mqtt.example.com'

mqttClient.on('connect', () => {
  console.log('Connected to MQTT broker');
});

mqttClient.on('error', (err) => {
  console.error(`Failed to connect to MQTT broker: ${err}`);
});

// Subscribe to a topic
mqttClient.subscribe('weightTopic');//'mytopic'

// Handle incoming MQTT messages
mqttClient.on('message', (topic, message) => {
  console.log(`Received message on topic ${topic}: ${message.toString()}`);
});

// Handle incoming HTTP requests
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});




