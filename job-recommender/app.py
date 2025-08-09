from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import re
import logging
import numpy as np
from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load model components
model = joblib.load("job_model.pkl")
vectorizer = joblib.load("vectorizer.pkl")
mlb = joblib.load("label_binarizer.pkl")

def clean_text(text):
    """Enhanced text cleaning while preserving important technical terms"""
    # Remove HTML tags
    text = re.sub(r'<.*?>', '', text)
    # Keep important punctuation and symbols
    text = re.sub(r'[^a-zA-Z0-9\s\-\+\.\,\/#\+%\(\)\[\]\{\}]', ' ', text)
    # Normalize whitespace
    text = re.sub(r'\s+', ' ', text)
    text = text.lower().strip()
    
    # Keep important technical terms that might be in stop words
    important_terms = {'c', 'c++', 'c#', 'r', 'go', 'sql', 'nosql', 'ml', 'ai', 'iot', 'api'}
    custom_stop_words = set(ENGLISH_STOP_WORDS) - important_terms
    
    return ' '.join([w for w in text.split() if w not in custom_stop_words])

@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.get_json()
    resume = data.get("resume", "")
    
    logger.info(f"Received recommendation request. Resume length: {len(resume)} chars")
    
    if not resume:
        logger.warning("Empty resume received")
        return jsonify({"error": "Resume is required"}), 400
        
    if len(resume) < 50:
        logger.warning(f"Resume too short: {len(resume)} characters")
        return jsonify({
            "predicted_categories": ["General IT - Resume too short"],
            "warning": "The resume text is very short. For better results, provide more detailed information."
        })

    try:
        # Clean and preprocess the resume
        cleaned = clean_text(resume)
        logger.info(f"Cleaned resume text length: {len(cleaned)} characters")
        
        # Transform the text using the vectorizer
        vec = vectorizer.transform([cleaned])
        
        # Get prediction scores
        scores = model.decision_function(vec)[0]
        logger.info(f"Raw prediction scores: {scores}")
        
        # Use a lower threshold for more predictions
        threshold = 0.15
        preds = (scores >= threshold).astype(int)
        
        # Ensure preds is a 2D numpy array
        preds = np.array(preds).reshape(1, -1)  # Reshape to (1, n_classes)
        
        # Get the predicted labels
        labels = mlb.inverse_transform(preds)[0]
        
        # If no labels meet the threshold, try with an even lower threshold
        if len(labels) == 0:
            logger.info("No categories met the threshold, trying with lower threshold (0.1)")
            preds = (scores >= 0.1).astype(int).reshape(1, -1)
            labels = mlb.inverse_transform(preds)[0]
        
        # If still no labels, return the top category by score
        if len(labels) == 0:
            top_category_idx = scores.argmax()
            if scores[top_category_idx] > 0.05:  # Very low threshold for at least one category
                labels = [mlb.classes_[top_category_idx]]
                logger.info(f"Using top category by score: {labels[0]} (score: {scores[top_category_idx]:.2f})")
        
        # Prepare response
        result = {
            "predicted_categories": list(labels) if len(labels) > 0 else ["General IT"],
            "debug": {
                "resume_length": len(resume),
                "cleaned_length": len(cleaned),
                "threshold_used": float(threshold),
                "num_categories_found": len(labels)
            }
        }
        
        logger.info(f"Predicted categories: {result['predicted_categories']}")
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in recommendation: {str(e)}", exc_info=True)
        return jsonify({
            "error": "Error processing request",
            "details": str(e),
            "categories": ["General IT - Processing Error"]
        }), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001, debug=True)