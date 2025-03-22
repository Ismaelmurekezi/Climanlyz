from pyspark.sql import SparkSession
from pyspark.sql.functions import avg, sum, trim, col
from pyspark.sql.types import StructType, StructField, StringType, DoubleType
import pandas as pd


def analyze_data(file_path):
    """Process CSV data using Apache Spark Worker Nodes and return aggregated results."""
    
    # Initialize Spark Session
    spark = SparkSession.builder.appName("ClimateWorker").getOrCreate()

    # Define schema for data consistency
    schema = StructType([
        StructField("City", StringType(), True),
        StructField("Temperature (°C)", DoubleType(), True),
        StructField("Rainfall (mm)", DoubleType(), True),
        StructField("Region", StringType(), True)
    ])

    df = spark.read.csv(file_path, header=True, schema=schema)
    
    # Clean data: trim whitespace from Region column
    df = df.withColumn("Region", trim(col("Region")))

    # Aggregate: Average temperature and total rainfall per region
    region_summary = df.groupBy("Region").agg(
        avg("`Temperature (°C)`").alias("AvgTemperature"),
        sum("`Rainfall (mm)`").alias("TotalRainfall")
    )

    # Convert results to a JSON-friendly Python dictionary
    result = region_summary.toPandas().to_dict(orient="records")
    
    # Ensure all values are native Python types (for JSON serialization)
    for record in result:
        for key, value in record.items():
            if hasattr(value, 'tolist'): 
                record[key] = value.item()
    
    # Stop Spark session
    spark.stop()

    return result
