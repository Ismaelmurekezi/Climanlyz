from flask import Flask
from flask_pymongo import PyMongo
from dotenv import load_dotenv,find_dotenv

load_dotenv(find_dotenv())
import os

app = Flask(__name__)
app.config["MONGO_URI"] = "Mongo-DB"
mongo = PyMongo(app)

@app.route("/")
def Home():
    mongo.db.users.insert_one({"numbers":3}) 
    return "Hello there"

app.run(debug=True)


