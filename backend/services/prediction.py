import joblib
import os

class CrimePredictionService:
    def __init__(self):
        self.model = None
        self.label_encoders = {}

    def load_model(self):
        try:
            self.model = joblib.load('models/crime_predictor.pkl')
            self.label_encoders = joblib.load('models/label_encoders.pkl')
            return True
        except Exception as e:
            print(f"Error loading model: {str(e)}")
            return False

# Initialize the prediction service
prediction_service = CrimePredictionService()

def predict_crime_type(city, age_group, gender, time_of_day, month, day_of_week):
    try:
        # Load the model if not already loaded
        if prediction_service.model is None:
            if not prediction_service.load_model():
                return {"error": "Model not found. Please train the model first."}

        # Prepare input data
        input_data = {
            'city': city.strip(),
            'age_group': age_group.strip(),
            'gender': gender.strip(),
            'time_of_day': time_of_day.strip(),
            'month': str(month).strip(),
            'day_of_week': day_of_week.strip()
        }

        # Ensure all features are encoded and in the correct order
        feature_order = ['city', 'age_group', 'gender', 'time_of_day', 'month', 'day_of_week']
        try:
            encoded_features = []
            for col in feature_order:
                encoder = prediction_service.label_encoders.get(col)
                val = input_data[col]
                print(f"Encoding {col}: '{val}' | Available: {encoder.classes_}")
                encoded_features.append(encoder.transform([val])[0])
        except Exception as e:
            return {"error": f"Invalid value for {col}: {val}"}

        # Make prediction
        prediction = prediction_service.model.predict([encoded_features])[0]
        crime_desc = prediction_service.label_encoders['crime'].inverse_transform([prediction])[0]
        probabilities = prediction_service.model.predict_proba([encoded_features])[0]
        class_labels = prediction_service.model.classes_

        # Get top 3 likely crimes
        top_indices = probabilities.argsort()[-3:][::-1]
        top_crimes = [
            {
                "crime_type": prediction_service.label_encoders['crime'].inverse_transform([class_labels[i]])[0],
                "probability": float(probabilities[i])
            }
            for i in top_indices
        ]

        return {
            "predicted_crime_type": crime_desc,
            "top_crimes": top_crimes,
            "probabilities": {prediction_service.label_encoders['crime'].inverse_transform([class_labels[i]])[0]: float(probabilities[i]) for i in top_indices},
            "confidence": float(max(probabilities))
        }
    except Exception as e:
        return {"error": f"Prediction failed: {str(e)}"}