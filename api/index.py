from flask import Flask, request, jsonify
from flask_cors import CORS

from utils import get_current_rate, get_historical_rates

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/api/get-forex-rates', methods=['GET'])
def get_forex_rates():
    from_currency = request.args.get('from')
    to_currency = request.args.get('to')

    historical_rates = get_historical_rates(from_currency, to_currency)
    current_rate = get_current_rate(from_currency, to_currency)

    res = {
        "historical_rates": historical_rates,
        "current_rate": current_rate
    }

    return jsonify(res)


if __name__ == '__main__':
    app.run()
