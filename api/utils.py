from flask import Flask, request, jsonify
from flask_cors import CORS

from dotenv import load_dotenv
import os

import requests

load_dotenv()

AV_API_KEY = os.getenv('ALPHA_VANTAGE_API_KEY')
AV_CURRENT_RATE_PATH = 'https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&'
AV_HISTORICAL_RATES_PATH = 'https://www.alphavantage.co/query?function=FX_DAILY&'

def get_current_rate(from_currency, to_currency):
    url = f'{AV_CURRENT_RATE_PATH }from_currency={from_currency}&to_currency={to_currency}&apikey={AV_API_KEY}'
    res = requests.get(url)
    data = res.json()

    bid = float(data['Realtime Currency Exchange Rate']['8. Bid Price'])
    ask = float(data['Realtime Currency Exchange Rate']['9. Ask Price'])

    avg_rate = (bid + ask) / 2
    return avg_rate

def get_historical_rates(from_currency, to_currency):
    url = f'{AV_HISTORICAL_RATES_PATH}from_symbol={from_currency}&to_symbol={to_currency}&apikey={AV_API_KEY}'
    res = requests.get(url)
    data = res.json()

    daily_rates = data['Time Series FX (Daily)']

    daily_avgs = {}
    for date in sorted(daily_rates.keys()):
        high = float(daily_rates[date]['2. high']) 
        low = float(daily_rates[date]['3. low'])

        avg_rate = (high + low) / 2
        daily_avgs[date] = avg_rate

    return daily_avgs

