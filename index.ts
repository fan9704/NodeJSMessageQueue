import express, {NextFunction, Request, Response} from 'express';
import mqtt from 'mqtt';
import * as dotenv from "dotenv";

let username:String = "FKT";//TODO: Change it
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
// mqttClient.subscribe('/message/#'); //接收全部 /message主題 開頭的訊息
mqttClient.subscribe(`/message/${username}`); //接收/message/自己的訊息
mqttClient.subscribe(`/message/lobby`); //接收/message/lobby 公共聊天室

// Handle incoming MQTT messages
mqttClient.on('message', (topic, message) => {
    if(topic == `/message/${username}`){
        console.log(`收到私人訊息:${message.toString()}`);
    }else if(topic == '/message/lobby'){
        console.log(`[大廳]:${message.toString()}`);
    }else{
        console.log(`[偷看別人訊息] 收件人:${topic} 訊息: ${message.toString()}`);
    }

});

// Handle incoming HTTP requests
app.get('/', (req, res) => {
  res.send(`Hello, World! I am ${username}`);
});
app.get('/pub',(req:Request,res:Response,next:NextFunction)=>{
    // Publish a Message
    mqttClient.publish(`/message/${username}`,`I am ${username}`);
    res.send(`Hello, World! I am ${username}`);
})
app.post('/pub', express.json(),(req:Request,res:Response,next:NextFunction)=>{
    let receiver:String = req.body["receiver"];
    let message:String = req.body["message"];

    // Publish a Message
    mqttClient.publish(`/message/${receiver}`,`${message}`);//TODO: Send JSON With Sender
    res.send(`Receiver ${receiver} Message ${message}`);
})
app.get('/pub2/:receiver/:message', express.json(),(req:Request,res:Response,next:NextFunction)=>{
    let receiver:String = req.params["receiver"];
    let message:String = req.params["message"];

    // Publish a Message
    mqttClient.publish(`/message/${receiver}`,`${message}`);
    res.send(`Receiver ${receiver} Message ${message}`);
})
app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});




