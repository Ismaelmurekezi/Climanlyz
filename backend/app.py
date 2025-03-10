from flask import Flask
from flask_pymongo import PyMongo
from dotenv import load_dotenv,find_dotenv

load_dotenv(find_dotenv())
import os

app = Flask(__name__)
# app.config["MONGO_URI"] = "mongodb://localhost:27017/Climanlyz"
app.config["MONGO_URI"] = "mongodb+srv://ishmure:ismael123@cluster0.yror584.mongodb.net/Climanlyz?retryWrites=true&w=majority"
mongo = PyMongo(app)

@app.route("/")
def Home():
    mongo.db.users.insert_one({"numbers":3}) 
    return "Hello there"

app.run(debug=True)


