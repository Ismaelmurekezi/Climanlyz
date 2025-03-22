from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from dotenv import load_dotenv, find_dotenv
from flask_cors import CORS
from celery import Celery
import os
from bson import json_util
import json
from pyspark.sql import SparkSession

spark = SparkSession.builder.appName("ClimateAnalysis").master("spark://172.31.128.167:7077").getOrCreate()



load_dotenv(find_dotenv())
mongo_db = os.environ.get("MONGODB_URL")


app = Flask(__name__)
CORS(app)
app.config["MONGO_URI"] = mongo_db
mongo = PyMongo(app)


def make_celery(app):
    celery = Celery(
        app.import_name,
        broker=app.config['CELERY_BROKER_URL'],
        backend=app.config['CELERY_RESULT_BACKEND']
    )
    celery.conf.update(app.config)
    return celery

app.config["CELERY_BROKER_URL"] = "redis://172.31.128.167:6379/0"
app.config["CELERY_RESULT_BACKEND"] = "redis://172.31.128.167:6379/0" 
celery = make_celery(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Welcome to Climanlyz Application"})


@app.route("/upload", methods=["POST"])
def upload_file():
    """Handle CSV file upload and start processing."""
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    # Start processing the file in the background
    process_csv.delay(file_path)

    return jsonify({"message": "File uploaded successfully, processing started"}), 202


@app.route("/results", methods=["GET"])
def get_results():
    """Retrieve processed climate data from MongoDB."""
    results = list(mongo.db.regional_analysis.find({}))
    # Convert MongoDB ObjectId to string for JSON serialization
    return json.loads(json_util.dumps(results)), 200


# Define task
@celery.task(name="backend.app.process_csv")
def process_csv(file_path):
    """Background task to process CSV data using Spark."""
    from backend.spark_task import analyze_data
    result = analyze_data(file_path)

    # Store results in MongoDB
    inserted_ids = mongo.db.regional_analysis.insert_many(result).inserted_ids
    
    # Return a serializable result (not the MongoDB documents with ObjectIds)
    return {"status": "success", "processed_records": len(result)}


if __name__ == "__main__":
    app.run(debug=True,host="0.0.0.0", port=5000)