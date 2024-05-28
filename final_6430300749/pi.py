import random
import pymongo
import datetime
import paho.mqtt.client as mqtt
import RPi.GPIO as GPIO

PUMP_PIN = 5
LIGHT_PIN = 6
BUG_PIN = 26

GPIO.setmode(GPIO.BCM)
GPIO.setup ([PUMP_PIN, LIGHT_PIN, BUG_PIN], GPIO.OUT)

# สร้างการเชื่อมต่อ MongoDB
client_mongo = pymongo.MongoClient("mongodb+srv://poomlak:Poom8704@cluster0.9aaniaa.mongodb.net/")
db = client_mongo["mqtt_data"]
collection = db["status"]




def on_publish(client):
    msg_count = 0
    while True:
        time.sleep(3)
        topic = "poomlakenvs"
        msg = f"{msg_count+1},{msg_count+2},{msg_count+3},{msg_count+4},{msg_count+5},{msg_count+6},{msg_count+7}"
        result = client.publish(topic, msg)
        # result: [0, 1]
        print(msg)
        if msg_count==100:
           msg_count =0
        else:
           msg_count+=3



def on_connect(client, userdata, flags, rc):
    print("Connected with result code " + str(rc))
    client.subscribe("waterpumpV1")
    client.subscribe("LightV1")
    client.subscribe("bugV1")
    client.subscribe("poombutpump")
    client.subscribe("poombutfert")
    client.subscribe("poombutbug")
    client.subscribe("poomlaktest")
    client.subscribe("poomlakUpBug")
    client.subscribe("poomlakUpPlant")
    client.subscribe("poomlakUpTimer")
    

def on_message(client, userdata, msg):
    payload = msg.payload.decode()
    topic = msg.topic

    print("Received message: " + payload + " on topic: " + topic)

    # บันทึกข้อมูลลงใน MongoDB
    data = {
        "topic": topic,
        "status": payload,
        "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")  # เพิ่ม timestamp เพื่อบันทึกเวลา
    }
    collection.insert_one(data)

    # ตรวจสอบ topic และควบคุมอุปกรณ์ตามที่กำหนด
    if topic == "waterpumpV1":
        if payload == "True":
            GPIO.output(PUMP_PIN, GPIO.LOW)
            print("Pump turned ON")
        elif payload == "False":
            GPIO.output(PUMP_PIN, GPIO.HIGH)
            print("Pump turned OFF")
        else:
            print("Invalid payload for water pump topic")
    elif topic == "LightV1":
        if payload == "True":
            GPIO.output(LIGHT_PIN, GPIO.LOW)
            print("Light turned ON")
        elif payload == "False":
            GPIO.output(LIGHT_PIN, GPIO.HIGH)
            print("Light turned OFF")
        else:
            print("Invalid payload for light topic")
    elif topic == "bugV1":
        if payload == "True":
            GPIO.output(BUG_PIN, GPIO.LOW)
            print("Bugkiller turned ON")
        elif payload == "False":
            GPIO.output(BUG_PIN, GPIO.HIGH)
            print("Bugkiller turned OFF")
        else:
            print("Invalid payload for bugkiller topic")





    elif msg.topic == "poomlaktest":
            try:
                data = payload.split(",")
                device_type = data[0].strip()
                status = data[1].strip()
 
                print(f"Device Type: {device_type}, Status: {status}")
 
                if device_type == "waterPump" and status == "true":
                    GPIO.output(PUMP_PIN, GPIO.LOW)
                    print("Pump turned ON")
                elif device_type == "waterPump" and status == "false":
                    GPIO.output(PUMP_PIN, GPIO.HIGH)
                    print("Pump turned OFF")
                elif device_type == "fertilizer" and status == "true":
                    GPIO.output(LIGHT_PIN, GPIO.LOW)
                    print("Light turned ON")
                elif device_type == "fertilizer" and status == "false":
                    GPIO.output(LIGHT_PIN, GPIO.HIGH)
                    print("Light turned OFF")
                elif device_type == "bugkiller" and status == "true":
                    GPIO.output(BUG_PIN, GPIO.LOW)
                    print("Bugkiller turned ON")
                elif device_type == "bugkiller" and status == "false":
                    GPIO.output(BUG_PIN, GPIO.HIGH)
                    print("Bugkiller turned OFF")
                    
        else:
        print("Invalid topic")

broker = 'm15.cloudmqtt.com'
port = 12987
username = 'cyejnmdr'
password = 'Is7roaqnQX09'

client_id = f'python-mqtt-{random.randint(0, 1000)}'
client = mqtt.Client(client_id)
client.username_pw_set(username, password)
client.on_connect = on_connect
client.on_message = on_message
client.on_publish = on_publish

client.connect(broker, port, 60)
client.loop_forever()
