from flask import Flask, g, request, jsonify
from flask_cors import CORS

from utils import get_current_rate, get_historical_rates
from model import get_fx_forecast

import traceback
import sys

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello_world():
    return 'Flask server started'

@app.route('/api/get-forex-rates', methods=['GET'])
def get_forex_rates():
    from_currency = request.args.get('from')
    to_currency = request.args.get('to')
    perform_prediction = request.args.get('performForecast')

    try:
        current_rate = get_current_rate(from_currency, to_currency)
        historical_rates = get_historical_rates(from_currency, to_currency)

        predicted_rates = {}
        if perform_prediction == "true":
            predicted_rates = get_fx_forecast(from_currency, to_currency, historical_rates)

        res = {
            "historical_rates": historical_rates,
            "current_rate": current_rate,
            "predicted_rates": predicted_rates
        }
        return jsonify(res), 200
    
    except Exception as e:
        exc_type, exc_value, exc_tb = sys.exc_info()
        exc_string = "".join(traceback.format_exception(exc_type, exc_value, exc_tb))
        error_res = {
            "error_message": exc_string,
        }
        return jsonify(error_res), 500


if __name__ == '__main__':
    app.run()
