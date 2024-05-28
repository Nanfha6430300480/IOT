const Env = require('./models/env');
const Config = require('./models/configmodel');
const Status = require('./models/devicestatus');
const Photo = require('./models/photo');
const express = require('express');
var qs = require('querystring');
const mongoose = require('mongoose');
const hbs = require('hbs');
var path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');
const multer = require('multer');
const router = express.Router();
// กำหนดตำแหน่งที่จะเก็บไฟล์ที่อัปโหลด
 
 
var app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.use(express.urlencoded());
app.use(express.json());
app.use(upload.single('image'));
 
 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views')
const static_path = path.join(__dirname, "/public")
app.use(express.static(static_path));
console.log(static_path);
const WebSocket = require('ws');
const { env } = require('process');
hbs.registerHelper('iff', function (a, operator, b, opts) {
  var bool = false;
  switch (operator) {
    case '==':
      bool = a == b;
      break;
    case '>':
      bool = a > b;
      break;
    case '<':
      bool = a < b;
      break;
    case '!=':
      bool = a != b;
      break;
    default:
      throw "Unknown operator " + operator;
  }
 
  if (bool) {
    return opts.fn(this);
  } else {
    return opts.inverse(this);
  }
});
 
hbs.registerHelper('ifCond', function (v1, options) {
  if (v1 % 3 == 2) {
    return options.fn(this);
  }
  return options.inverse(this);
});
 
hbs.registerHelper('iftime', function (v1, v2, options) {
  if (v1 == v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});
 
hbs.registerHelper('forlist', function (v1, v2, options) {
  var i;
  var cmd = "<option selected value=" + v2 + ">" + (v2) + "</option>";
  for (i = 0; i < v1.length; i++) {
    if (v1[i] != v2) {
      cmd += "<option value=" + v1[i] + ">" + (v1[i]) + "</option>"
 
    }
 
  }
  return cmd;
});
 
const port = 3000;
var hum = "30";
 
 
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
 
 
 
var appPort = 3001;
// Normal HTTP configuration
//let http = require('http').Server(app;
 
//const wss = new WebSocket.Server({ server:http });
const wss = new WebSocket.Server({ port: appPort });
wss.on('connection', async function connection(wssLocal) {
  console.log('A new client Connected!111111111111111111 11111111111111111111111111');
  // ws.send('node0_status_pir_x');
 
 
  wss.on('message', function incoming(message) {
    console.log('received: %s', message);
 
    wss.clients.forEach(function each(client) {
      if (client !== wss && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
 
  });
  const query = {};
  const sort = { time: -1 };
  const limit = 1;
  const envs = await Env.find({}).sort(sort).limit(1);
  console.log("AAAAAAAAAAAAAAAAAAAAAAAAAA")
  console.log(envs);
  console.log("BBBBBBBBBBBBBBBBBBBB")
  var test = [{ "temperature": envs[0].temperature, "humidity": envs[0].humidity, "ec": envs[0].ec, "ph": envs[0].ph, "n": envs[0].n, "p": envs[0].p, "k": envs[0].k, }];
 
 
  var statusAllJson = JSON.stringify(test);
 
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
 
      console.log(statusAllJson);
      client.send(statusAllJson);
 
    }
  });
 
 
});
 
 
 
mongoose.connect('mongodb+srv://poomlak:Poom8704@cluster0.9aaniaa.mongodb.net/', {
  useNewUrlParser: true
});
 
app.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
app.get('/temp', (req, res) => {
  var temp = 10;
  var temperature = "temp=" + temp
  res.send(temperature);
});
app.get('/tracking', async (req, res) => {
 
  //const log = await managementlog.find();
  //console.log(log)
  const log = await Status.find();
  //var log={};
  //log=[{"type": "Delete","devicename": "pump1", "username":"admin","action": "ON","time": "00"}]
  res.render("tracking", { log: log })
 
});
 
app.get('/setting', async (req, res) => {
 
  //const log = await managementlog.find();
  //console.log(log)
  const log = await Status.find();
  //var log={};
  //log=[{"type": "Delete","devicename": "pump1", "username":"admin","action": "ON","time": "00"}]
  res.render("setting", { log: log })
 
});
 
app.get('/aboutus', async (req, res) => {
 
  //const log = await managementlog.find();
  //console.log(log)
  const log = await Status.find();
  //var log={};
  //log=[{"type": "Delete","devicename": "pump1", "username":"admin","action": "ON","time": "00"}]
  res.render("aboutus", { log: log })
 
});
app.get('/photo', async (req, res) => {
 
  //const log = await managementlog.find();
  //console.log(log)
  const log = await Status.find();
  //var log={};
  //log=[{"type": "Delete","devicename": "pump1", "username":"admin","action": "ON","time": "00"}]
  res.render("photo", { log: log })
 
});
 
 
app.get('/getenvs', async (req, res) => {
  const envs = await Env.findOne({});
  res.json(envs);
});
app.post('/sethum', (req, res) => {
  var data = ''
  req.on('data', chunk => {
    console.log('A chunk of data has arrived: ', chunk);
    data = data + chunk;
    console.log(data);
    hum = data;
  });
  req.on('end', () => {
    console.log('No more data');
  })
  res.sendStatus(200);
});
 
var mqtt = require('mqtt');
 
 
const MQTT_SERVER = "m15.cloudmqtt.com";
const MQTT_PORT = "12987";
//if your server don't have username and password let blank.
const MQTT_USER = "cyejnmdr";
const MQTT_PASSWORD = "Is7roaqnQX09";
 
// Connect MQTT
var client = mqtt.connect({
  host: MQTT_SERVER,
  port: MQTT_PORT,
  username: MQTT_USER,
  password: MQTT_PASSWORD
});
 
client.on('connect', function () {
  // Subscribe any topic
  console.log("MQTT Connect");
  client.subscribe('poomlakenvs', function (err) {
    if (err) {
      console.log(err);
    }
  });
  client.subscribe('poompump', function (err) {
    if (err) {
      console.log(err);
    }
  });
  client.subscribe('poomfert', function (err) {
    if (err) {
      console.log(err);
    }
  });
  client.subscribe('poombug', function (err) {
    if (err) {
      console.log(err);
    }
  });
});
 
 
client.on('message', async function (topic, message) {
  console.log(topic, message.toString());
  if (topic === 'poomlakenvs') {
      var temps = message.toString().split(",");
      axios.post('http://localhost:3000/envs', {
          humidity: temps[0],
          temperature: temps[1],
          ec: temps[2],
          ph: temps[3],
          n: temps[4],
          p: temps[5],
          k: temps[6]
      })
      .then(function (response) {
          console.log(response);
      })
      .catch(function (error) {
          console.log(error);
      });
 
  } else if (topic === 'poompump') {
      var temp_pump =  message.toString();
      var button_pump = (temp_pump === "true") ? "true" : "false";
      var payload = {
          device: "waterPump",
          status: button_pump
      };
      client.publish("poombutpump", JSON.stringify(payload), { qos: 0, retain: false }, (error) => {
        if (error) {
            console.error(`Error publishing MQTT message to `, error);
        } else {
            console.log(`MQTT message published successfully `);
        }
       });
      axios.post('http://localhost:3000/updateStatus',payload)
      .then(function (response) {
          console.log(response);
      })
      .catch(function (error) {
          console.log(error);
      });
      
  } else if (topic === 'poomfert') {
      var temp_fert =  message.toString();
      var button_fert = (temp_fert === "true") ? "true" : "false";
      var payload ={
          device: "fertilizer",
          status: button_fert
      };
      client.publish("poombutfert", JSON.stringify(payload), { qos: 0, retain: false }, (error) => {
        if (error) {
            console.error(`Error publishing MQTT message to `, error);
        } else {
            console.log(`MQTT message published successfully `);
        }
       });
      axios.post('http://localhost:3000/updateStatus',payload)
      .then(function (response) {
          console.log(response);
      })
      .catch(function (error) {
          console.log(error);
      });
 
  } else if (topic === 'poombug') {
      var temp_bug =  message.toString();
      var button_bug = (temp_bug === "true") ? "true" : "false";
      var payload = {
          device: "bugkiller",
          status: button_bug
      };
      client.publish("poombutbug", JSON.stringify(payload), { qos: 0, retain: false }, (error) => {
        if (error) {
            console.error(`Error publishing MQTT message to `, error);
        } else {
            console.log(`MQTT message published successfully `);
        }
       });
      axios.post('http://localhost:3000/updateStatus',payload)
              .then(function (response) {
                  console.log(response);
              })
              .catch(function (error) {
                  console.log(error);
              });
          }
});
 
 
 
 
 
 
app.use(express.json());
// mock data
const products = [{}];
 
app.post('/pump', async (req, res) => {
  const payload = req.body;
 
  var date_ob = new Date();
  /*const saveEnvs = new Env({
    status: payload.status,
    device: "pump",
    time: date_ob,
    
  })
  //const product = new Env(payload);
  await saveEnvs.save(); */
  //send MQTT broker;  publisher (nodejs)
  console.log(payload.status);
 
  client.publish("testiotsub1", payload.status, { qos: 0, retain: false }, (error) => {
    if (error) {
      console.error(error)
    }
  })
 
  res.status(201).end();
});
 
 
app.post('/envs', async (req, res) => {
  const payload = req.body;
 
  var date_ob = new Date();
  const saveEnvs = new Env({
    temperature: payload.temperature,
    humidity: payload.humidity,
    ph: payload.ph,
    ec: payload.ec,
    time: date_ob,
    n: payload.n,
    p: payload.p,
    k: payload.k,
 
  })
  //const product = new Env(payload);
  await saveEnvs.save();
  const query = {};
  const sort = { time: -1 };
  const limit = 1;
  const envs = await Env.find({}).sort(sort).limit(1);
 
  console.log(envs);
  var test = [{ "temperature": envs[0].temperature, "humidity": envs[0].humidity, "ec": envs[0].ec, "ph": envs[0].ph, "n": envs[0].n, "p": envs[0].p, "k": envs[0].k, }];
 
 
  var statusAllJson = JSON.stringify(test);
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
 
      console.log(statusAllJson);
      client.send(statusAllJson);
 
    }
  });
 
 
  res.status(201).end();
});
 
 
app.post("/ajax_updateWaterTimer", async (req, res) => {
  //console.log(req);
  console.log("EEEEEEEEEEEEEEEEEEEEEE =" + req.body.id);
  console.log("EEEEEEEEEEEEEEEEEEEEEE =" + req.body.waterTimer);
  try {
 
    const payload = req.body;
    console.log(payload);
 
    var date_ob = new Date();
    const saveConfig = new Config({
      waterTimer: payload.waterTimer,
      time: date_ob,
 
    })
    await saveConfig.save();
 
    console.log("aaaaaaaaaaaaaaaaaaaaaaaa");
 
    return res.status(200).json({ status: true })
  } catch (error) {
    res.send("Set Status error");
  }
});
 
 
app.post("/updateTimer", async (req, res) => {
  console.log("Received water timer update:", req.body.waterTimer);
  try {
    const payload = req.body;
    console.log("Payload:", payload);
 
    var date_ob = new Date();
    const saveConfig = new Config({
      type: payload.type,
      waterTimer: payload.waterTimer,
      time: date_ob,
    });
    await saveConfig.save();
    console.log("Water timer updated successfully");
 
    // Publishing message to MQTT topic
    const message = JSON.stringify({ waterTimer: payload.waterTimer,type:payload.type });
    client.publish('poomlakUpTimer', message, (error) => {
      if (error) {
        console.error("Error publishing message to MQTT:", error);
        res.status(500).json({ status: false, error: "Error publishing message to MQTT" });
      } else {
        console.log("Message published to MQTT successfully");
        res.status(200).json({ status: true }); // Return JSON response to the client
      }
    });
  } catch (error) {
    console.error("Error updating water timer:", error);
    res.status(500).json({ status: false, error: "Internal server error" }); // Return JSON response to the client
  }
});
 
app.post("/updatePlant", async (req, res) => {
  console.log("Received Plant timer update:", req.body.fertilizer);
  try {
    const payload = req.body;
    console.log("Payload:", payload);
 
    var date_ob = new Date();
    const savePlant = new Config({
      type: payload.type,
      fertilizer: payload.fertilizer,
      time: date_ob,
    });
    await savePlant.save();
    console.log("Plant timer updated successfully");
 
    // Publishing message to MQTT topic
    const message = JSON.stringify({ fertilizer: payload.fertilizer,type :payload.type});
    client.publish('poomlakUpPlant', message, (error) => {
      if (error) {
        console.error("Error publishing message to MQTT:", error);
        res.status(500).json({ status: false, error: "Error publishing message to MQTT" });
      } else {
        console.log("Message published to MQTT successfully");
        res.status(200).json({ status: true }); // Return JSON response to the client
      }
    });
  } catch (error) {
    console.error("Error updating Plant timer:", error);
    res.status(500).json({ status: false, error: "Internal server error" }); // Return JSON response to the client
  }
});
 
 
app.post("/updateBugkiller", async (req, res) => {
  console.log("Received Bug killer update:", req.body.bugkiller);
  try {
    const payload = req.body;
    console.log("Payload:", payload);
 
    var date_ob = new Date();
    const saveConfig = new Config({
      type: payload.type,
      bugkiller: payload.bugkiller,
      time: date_ob,
    });
    await saveConfig.save();
    console.log("Bugkiller timer updated successfully");
 
    // Publishing message to MQTT topic
    const message = JSON.stringify({ bugkiller: payload.bugkiller ,type:payload.type});
    client.publish('poomlakUpBug', message, (error) => {
      if (error) {
        console.error("Error publishing message to MQTT:", error);
        res.status(500).json({ status: false, error: "Error publishing message to MQTT" });
      } else {
        console.log("Message published to MQTT successfully");
        res.status(200).json({ status: true }); // Return JSON response to the client
      }
    });
  } catch (error) {
    console.error("Error updating Bugkiller timer:", error);
    res.status(500).json({ status: false, error: "Internal server error" }); // Return JSON response to the client
  }
});
 
 
app.post("/updateStatus", async (req, res) => {
  console.log("Received Status update:", req.body.status); // Accessing req.body.Interval instead of req.body.timer
  try {
    const payload = req.body;
    console.log("Payload:", payload);
 
    var date_ob = new Date();
    const saveConfig = new Status({
      device: payload.device,
      status: payload.status, // Accessing payload.Interval instead of payload.timer
      time: date_ob,
    });
    await saveConfig.save();
    console.log("Status updated successfully");
 
    return res.status(200).json({ status: true }); // Return JSON response to the client
  } catch (error) {
    console.error("Error updating Status:", error);
    res.status(500).json({ status: false, error: "Internal server error" }); // Return JSON response to the client
  }
});
 
app.post("/device_status", async (req, res) => {
  const { device, status } = req.body;
 
  // Publish message to MQTT broker
  const message = `${device},${status}`;
  client.publish('poomlaktest', message, (error) => {
    if (error) {
      console.log("Publish error", error);
      res.status(500).json({ status: false, message: "Internal server error" });
    }
    return res.status(200).json({ status: true });
  });
  // Save device status to MongoDB
  var date_ob = new Date(); // Create current date object
  const saveConfig = new Status({
    device: device,
    status: status,
    time: date_ob,
  });
  // Save data to MongoDB
  try {
    await saveConfig.save();
    console.log("Status updated successfully");
  } catch (error) {
    console.error("Error saving status:", error);
    // Handle error if save operation fails
  }
});
 
 
 
app.post('/upload', async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
 
    const { openTime, closeTime } = req.body;
 
    const newPhoto = new Photo({
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype
      },
      fileName: req.file.originalname,
      openTime,
      closeTime
    });
 
    await newPhoto.save();
 
    return res.status(201).json({ message: 'Image uploaded successfully' });
  } catch (error) {
    console.error('Error uploading image:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
 
app.get('/images', async (req, res) => {
  try {
    const photos = await Photo.find({}, { _id: 0, 'image': 1, 'fileName': 1, 'openTime': 1, 'closeTime': 1 });
 
    const photoData = photos.map(photo => ({
      imageUrl: `data:${photo.image.contentType};base64,${photo.image.data.toString('base64')}`,
      fileName: photo.fileName,
      openTime: photo.openTime,
      closeTime: photo.closeTime
    }));
 
    res.json(photoData);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});