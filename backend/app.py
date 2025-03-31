from flask import Flask, jsonify, request, make_response
from flask_pymongo import PyMongo
from dotenv import load_dotenv, find_dotenv
from flask_cors import CORS
from celery import Celery
import os
from bson import json_util, ObjectId
import json
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta
import time

load_dotenv(find_dotenv())
mongo_db = os.environ.get("MONGODB_URL")

app = Flask(__name__)
CORS(app)
app.config["MONGO_URI"] = mongo_db
mongo = PyMongo(app)

# Configure JWT
app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY", "your-secret-key-change-in-production")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
jwt = JWTManager(app)
bcrypt = Bcrypt(app)

def make_celery(app):
    celery = Celery(
        app.import_name,
        broker=app.config['CELERY_BROKER_URL'],
        backend=app.config['CELERY_RESULT_BACKEND']
    )
    celery.conf.update(app.config)
    return celery

app.config["CELERY_BROKER_URL"] = "redis://localhost:6379/0"
app.config["CELERY_RESULT_BACKEND"] = "redis://localhost:6379/0" 
celery = make_celery(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Welcome to Climanlyz Application"})

# User registration endpoint
@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    
    # Check if required fields are present
    if not data or not data.get("email") or not data.get("password") or not data.get("username"):
        return jsonify({"error": "Missing required fields"}), 400
    
    # Check if user already exists
    if mongo.db.users.find_one({"email": data["email"]}):
        return jsonify({"error": "User with this email already exists"}), 409
    
    # Hash the password
    hashed_password = bcrypt.generate_password_hash(data["password"]).decode("utf-8")
    
    # Create new user document
    new_user = {
        "username": data["username"],
        "email": data["email"],
        "password": hashed_password,
        "created_at": time.time()
    }
    
    # Insert into database
    result = mongo.db.users.insert_one(new_user)
    
    # Create access token
    access_token = create_access_token(identity=str(result.inserted_id))
    
    return jsonify({
        "message": "User registered successfully",
        "token": access_token,
        "user": {
            "id": str(result.inserted_id),
            "username": data["username"],
            "email": data["email"]
        }
    }), 201

# User login endpoint
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    
    # Check if required fields are present
    if not data or not data.get("email") or not data.get("password"):
        return jsonify({"error": "Missing email or password"}), 400
    
    user = mongo.db.users.find_one({"email": data["email"]})
    
    # Check if user exists and password is correct
    if not user or not bcrypt.check_password_hash(user["password"], data["password"]):
        return jsonify({"error": "Invalid email or password"}), 401
    
    # Create access token
    access_token = create_access_token(identity=str(user["_id"]))
    
    return jsonify({
        "message": "Login successful",
        "token": access_token,
        "user": {
            "id": str(user["_id"]),
            "username": user["username"],
            "email": user["email"]
        }
    }), 200

# Protected endpoint to check user status
@app.route("/user", methods=["GET"])
@jwt_required()
def get_user():
    current_user_id = get_jwt_identity()
    user = mongo.db.users.find_one({"_id": ObjectId(current_user_id)})
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    return jsonify({
        "id": str(user["_id"]),
        "username": user["username"],
        "email": user["email"]
    }), 200

# Now secure the upload and results endpoints with JWT
@app.route("/upload", methods=["POST"])
@jwt_required()
def upload_file():
    """Handle CSV file upload and start processing."""
    current_user_id = get_jwt_identity()
    
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    # Check if the file has been saved correctly
    if not os.path.exists(file_path):
        return jsonify({"error": f"File was not saved successfully at {file_path}"}), 500

    print(f"File saved successfully at {file_path}. Starting processing...")
    # Start processing the file in the background
    task = process_csv.delay(file_path)
    
    # Store the task information with user id
    mongo.db.user_tasks.insert_one({
        "user_id": current_user_id,
        "task_id": task.id,
        "file_name": file.filename,
        "status": "processing",
        "created_at": time.time()
    })

    return jsonify({
        "message": "File uploaded successfully, processing started",
        "task_id": task.id
    }), 202

@app.route("/results", methods=["GET"])
@jwt_required()
def get_results():
    """Retrieve processed climate data from MongoDB."""
    current_user_id = get_jwt_identity()
    
    # Get user's tasks
    user_tasks = list(mongo.db.user_tasks.find({"user_id": current_user_id}))
    
    if not user_tasks:
        return jsonify({"message": "No analysis results found for this user"}), 404
    
    # Get all results
    results = list(mongo.db.regional_analysis.find({}))
    
    # Convert MongoDB ObjectId to string for JSON serialization
    return json.loads(json_util.dumps(results)), 200

# Define task
@celery.task(name="backend.app.process_csv")
def process_csv(file_path):
    """Background task to process CSV data using Spark."""
    from backend.spark_task import analyze_data
    print(f"Processing CSV file at: {file_path}")
    result = analyze_data(file_path)

    # Store results in MongoDB
    inserted_ids = mongo.db.regional_analysis.insert_many(result).inserted_ids

    # Return a serializable result (not the MongoDB documents with ObjectIds)
    return {"status": "success", "processed_records": len(result)}

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)