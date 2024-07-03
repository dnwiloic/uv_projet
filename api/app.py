import os
import pickle

import openai
from config import openweatherapi, weatherapi
#import firebase_admin
#from firebase_admin import db
from flask import Flask, current_app, jsonify, request
from flask_cors import CORS
from flask_ngrok import run_with_ngrok
from plant import plant
from requests import get as requests_get
from requests import post as requests_post
from werkzeug.utils import secure_filename
import pandas as pd

""" key={
  "type": "service_account",
  "project_id": "iet-hack",
  "private_key_id": "15e6912b328af571ee4cdbefb709ce7b0eea0c89",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDf0ARV+1wFHh1Y\n5x+pdp7MEvDbHlqfFUypZ5QbHnq1UD5yoyavQLS3F8twCgm896G1BXm/4EVmrsUy\npYYmgSP7yrYJAt1J9UATuMJnsdy5zbcF7IAMx+MpXkbDxfupcbe2LkkeC9MQ+ecQ\nwuXSOPnV2nP5l8Z8u8WZCx3zeyK5OtEzkgvurdDqNQxk/9tAa6EWVqo9BCe8KBMl\nBYpmeweCfOJrbyF+mMV+6AX7VrvSnflz2AFT494FxkQydLyL3VeVgB8qrsGmkkwp\nUH56IJtLXb7FYB+j77a8ixNQXJqCrSBbKn95SS3u1UYeexSHFSvwPVM2+XiVwQ83\nH/II9VdRAgMBAAECggEANWZ/vlcetc7hYC6nGIsnqNflFVbo9teBZtMCnLTZQM0Q\nVVBVoM9+vsfD36vZdnecIuGXUr9rN6x/+w1Q1HuQDxnm9H/1Nhn4y6vT4KNon4F0\nh4qN497Gdb6bgkcI/H0YQPTKt8tI9R43MkHaTV4QSCTa8oSy1FyF8TXck9U/q/Np\nLd8E329TKuZjvFEAM+qernQQKwFwhFzx7MabUwzos+LTVcszBXdVO7lMXR7MGCqo\nW+m8hhYQCyryUYtXPvFoIXGy5f2ILkEg72D0qAlyUvkGtzj6nNYLXPbkAa+hKPCl\n/rgqAQmeNjc19iumUZEHM2AWTLVW/6+EO2b4MOe7lQKBgQDy1U9xTGuAfGmx9nLN\nve0dT9hANoFaD3MZoTG342gYj8rJZ4Khk4+Fomcx7iKFRmFp1DcbyQ1wrRPXcLMc\n3cRn8FTjfQ1IJi024XMl45JfW33Kvw37XdJFRdqB4ywl19pCyolRrt7Chr92Wk5J\n25iyrpjwAB/z4jqTZeIaFO0VPQKBgQDr8q/OsUTFuFzDrY7CW1tCxCtLCWtUg91B\nr5i8OTWSXYp8pK5Tvp0rIkQ+U1y4p3mU/Pt+mJFkzxfUz7XpykEUCrmqUKURylc4\nrRrXdN+N+QdvPwiGZo+mG02KUNwk4POePMJJdapohyO0Q4lk653b/daSdUbYWRA1\nLtsOJlGzpQKBgDkvBEMw9MvQAG/ZElXi2NijOdB9RV647qjlbbjZA2VtTxq4lmmI\nPy7//H8kjdqGpV/vin6vjMuw5lBAiN1OV/cGAGeFxj/sRY977crJWWm9ONUqwpck\nE+UeOwOFRJswxoQd/9JNdMWoR6QORgtcfAvv07IIxX2AE70sK99qeB4dAoGARXLH\nYJU44uGjHE2HiZmOQRawj4OUPeoaQ+1FjZFhPVWfH5TxYuDmLf4GDDpJPmi9Fqdn\n9xk9Imj6YL9KkifgA+AsSf82twfRqHL7RZO3AXjdQVdSUQz7Fy9OIXovcgNscZT8\nstaZc+7jCXofhL79VfVfJPi0A5YjeSPzgjSxM6kCgYEA7tqVh44CjR7JjllelytE\n8vB2oxnCFBmj2V7/d5ZKJGipzTa7f0Q+fU6UaB9BlVBUJMBtdgHwOMmb3Qz/0jzP\n/eLBAawDjK6ZqezDLqlqa/ftSD0ZuZiork6MjyGGKNX8qI0UPK6bnP34PIvDj+6C\nVcyqcYVCXozAPfvW0NUiVVA=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xbly6@iet-hack.iam.gserviceaccount.com",
  "client_id": "104729526328192505715",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xbly6%40iet-hack.iam.gserviceaccount.com"
}

cred_obj = firebase_admin.credentials.Certificate(key)
default_app = firebase_admin.initialize_app(cred_obj, {
	'databaseURL':'https://iet-hack-default-rtdb.firebaseio.com/'
	})
 """

app = Flask(__name__)
CORS(app)
#run_with_ngrok(app)

@app.route('/')
def home():
    return "Hello Welcome to the API homepage"

# Image API call
@app.route('/imageLink',methods=["POST"])
def imagelink():
    data=request.json
    image_link=data['link']
    return image_link

def load_model():
    with open('models/NBClassifier.pkl', 'rb') as f:
        return pickle.load(f)

def predict_crop_values(model, data):
    return model.predict(data)

@app.route('/predictCrop', methods=["POST"])
def predict_crop():
    try:
        # Load the pre-trained model
        model = load_model()

        # Extract user input from the POST request
        data = {
            'N': float(request.form['nitrogen']),
            'P': float(request.form['phosphorus']),
            'K': float(request.form['potassium']),
            'temperature': float(request.form['temperature']),
            'humidity': float(request.form['humidity']),
            'ph': float(request.form['ph']),
            'rainfall': float(request.form['rainfall'])
        }

        data_fr = pd.DataFrame([data])

        # Make prediction using the loaded model
        pred = predict_crop_values(model, data_fr)  # Assuming the model returns a single prediction
        print(pred)
        # Look up the predicted crop using the crop dictionary
        crop_dict = {
            1: 'rice', 2: 'maize', 3: 'jute', 4: 'cotton', 5: 'coconut', 6: 'papaya',
            7: 'orange', 8: 'apple', 9: 'muskmelon', 10: 'watermelon', 11: 'grapes',
            12: 'mango', 13: 'banana', 14: 'pomegranate', 15: 'lentil', 16: 'blackgram',
            17: 'mungbean', 18: 'mothbeans', 19: 'pigeonpeas', 20: 'kidneybeans',
            21: 'chickpea', 22: 'coffee', 23: 'Soyabeans', 24: 'beans', 25: 'peas',
            26: 'groundnuts', 27: 'cowpeas'
        }
        # predicted_crop_label = list(crop_dict.keys())[list(crop_dict.values()).index(int(pred))]
        predicted_crop_label = crop_dict.get(int(pred[0]), 'Unknown crop')

        # Prepare the recommendation result for the response
        result = f"{predicted_crop_label}"
        print("result for predict", result)
        return jsonify({'result': result})

    except Exception as e:
        print(e)
        return jsonify({'error': str(e), 'message': 'Error processing the request'})

@app.route('/weather', methods=['GET'])
def get_weather():
    # Retrieve latitude and longitude from request arguments
    lat = request.args.get('lat', '33.44')  # Default latitude if none provided
    lon = request.args.get('lon', '-94.04')  # Default longitude if none provided
    api_key = openweatherapi

    # Construct the API URL
    url = f"http://api.weatherapi.com/v1/current.json?key={weatherapi}&q={lat},{lon}&aqi=yes" #f"https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude=minutely,hourly,alerts&appid={api_key}"

    # Make the API request
    response = requests_get(url)
    data = response.json()

    # Check for errors in the API response
    if response.status_code != 200:
        return jsonify({'error': 'Failed to fetch weather data', 'message': data.get('message')}), response.status_code

    # Return the weather data
    return jsonify(data)


@app.route('/forecast', methods=['GET'])
def get_four_day_forecast():
    # Retrieve latitude and longitude from request arguments
    lat = request.args.get('lat', '33.44')  # Default latitude if none provided
    lon = request.args.get('lon', '-94.04')  # Default longitude if none provided
    api_key = openweatherapi

    # Construct the API URL
    url = f"http://api.weatherapi.com/v1/forecast.json?key={weatherapi}&q={lat},{lon}&days=3&aqi=yes&alerts=no" #f"https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude=current,minutely,hourly,alerts&appid={api_key}"

    # Make the API request
    response = requests_get(url)
    data = response.json()

    # Check for errors in the API response
    if response.status_code != 200:
        return jsonify({'error': 'Failed to fetch weather data', 'message': data.get('message')}), response.status_code

    # Filter out only the next 4 days of daily forecast data
    if 'forecast' in data:
        forecast_days = data['forecast']['forecastday']  # Skip the current day (index 0) and take the next four days
        return jsonify(forecast_days)
    else:
        return jsonify({'error': 'Daily forecast data not available'}), 404

# Point to the local LM Studio server
openai.api_key = 'lm-studio'
openai.api_base = 'http://localhost:1234/v1'

@app.route('/lmstudio', methods=['POST'])
def lmstudio():
    try:
        data = request.json
        prompt = data['prompt']
        
        # Define the initial system message
        history = [
            {"role": "system", "content": "You are a Cameroonian agriculture assistant. You always provide well-reasoned answers that are both correct and helpful."},
            {"role": "user", "content": prompt},
        ]

        # Send the prompt to the LM Studio model
        response = openai.ChatCompletion.create(
            model="lmstudio-community/Meta-Llama-3-8B-Instruct-GGUF",  # Replace with your specific model identifier
            messages=history,
            temperature=0.7,
        )
        print(response)
        # Extract the assistant's response
        assistant_message = response.choices[0].message['content']
        print(assistant_message)
        return jsonify({'response': assistant_message})
    except Exception as e:
        current_app.logger.error(f"Error: {e}")
        return jsonify({'message': 'Unsuccessful', 'error': str(e)}), 500

@app.route('/chat_completion', methods=['POST'])
def chat_completion():
    try:
        data = request.json
        prompt = data['prompt']

        data ={
          "model": "mistral-small-latest",
          "messages": [
            { "role": "assistant",
              "content": "You are a Cameroonian agriculture assistant. You always provide well-reasoned answers that are both correct and helpful."},
              {"role": "user",
              "content": prompt
            }
          ],
          "temperature": 0.7,
          "top_p": 1,
          "max_tokens": 512,
          "stream": False,
          "safe_prompt": False,
          "random_seed": 1337
        }
            #request.json
        headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 3Vw6h1Kb3lrdpFrk2FaPbztNN17isvj8'  # Replace YOUR_API_KEY with your actual API key
        }
        url = 'https://api.mistral.ai/v1/chat/completions'
        response = requests_post(url, json=data, headers=headers)
        print(response)
        response = response.json()
        assistant_message = response["choices"][0]["message"]['content']
        print(assistant_message)
        return jsonify({'response': assistant_message})
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({'error': str(e), 'message': 'Failed to process chat completion request'}), 500

@app.route('/upload_file', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file:
        filename = secure_filename(file.filename)
        file.save(os.path.join('/path/to/save', filename))  # Adjust the path as necessary

        # Now send the file to Mistral AI
        headers = {
            'Authorization': 'Bearer YOUR_API_KEY'  # Replace YOUR_API_KEY with your actual API key
        }

if __name__ == "__main__":
    app.run(debug=True)
