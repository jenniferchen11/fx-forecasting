import copy
import json
import os

import numpy as np
import pandas as pd
import torch
import torch.nn as nn
from constants import NUM_FORECASTED_DAYS
from dotenv import load_dotenv
from pandas.tseries.offsets import BDay


load_dotenv()
DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
DIRECTORY = os.getenv('ROOT_DIR')

class LSTM(nn.Module):
    '''
    PyTorch long short-term memory model single fully-connected layer.

    '''
    def __init__(self, input_num_feats, hidden_size, num_layers=1, device='cpu'):
        '''
        Parameters:
            input_num_feats (int): The number of input features
            hidden_size (int): The number of features in the hidden state
            num_layers (int): The number of recurrent layers
            device (str): The device to run the model
        '''
        super(LSTM, self).__init__()
        self.hidden_size = hidden_size
        self.num_layers = num_layers
        # add lstm layers
        self.lstm = nn.LSTM(
            input_num_feats,
            hidden_size,
            num_layers,
            batch_first=True)
        # add fully-connected linear layer
        self.fc = nn.Linear(hidden_size, input_num_feats)
        self.device = device

    def forward(self, x):
      # hidden state
      h0 = torch.zeros(self.num_layers, x.shape[0], self.hidden_size).to(self.device)
      #initial cell state
      c0 = torch.zeros(self.num_layers, x.shape[0], self.hidden_size).to(self.device)
      out, _ = self.lstm(x, (h0, c0))
      # filter out everything except the last timestep’s output
      out = self.fc(out[:, -1, :])
      return out


def get_model_path(from_currency, to_currency):
    model_list = f'{DIRECTORY}/constants/currency_mapping.json'
    f = open(model_list)
    model_list = json.load(f)

    is_inverted = False
    currency_pair = None

    if from_currency in model_list and to_currency in model_list[from_currency]:
        currency_pair = '_'.join([from_currency, to_currency])
    elif to_currency in model_list and from_currency in model_list[to_currency]:
        currency_pair = '_'.join([to_currency, from_currency])
        is_inverted = True
    if currency_pair is None:
        return None, None
        
    dir_models = f'{DIRECTORY}/trained_models'
    files = set(os.listdir(dir_models))

    for file in files:
        if currency_pair in file:
            model_path = f'{DIRECTORY}/trained_models/{file}'
            return model_path, is_inverted
    return None, None


def instantiate_model_w_weights(model_path):
    metadata_fpath = f'{DIRECTORY}/constants/hyperparameters.json'
    f = open(metadata_fpath)
    metadata= json.load(f)

    num_cols = 1
    num_lstm_units = metadata['num_lstm_units']
    num_lstm_layers = metadata['num_lstm_layers']

    model = LSTM(num_cols, num_lstm_units, num_lstm_layers, DEVICE)
    model.to(DEVICE)
    model.load_state_dict(torch.load(model_path, map_location=torch.device(DEVICE)), assign=True)
    return model


def forecast_future_sequence(num_prediction, model, input_data, lookback):
    prediction_list = input_data[-lookback:]
    prediction_list = prediction_list.reshape((lookback, 1))

    with torch.no_grad():
        for _ in range(num_prediction):
            x = copy.deepcopy(prediction_list[-(lookback):])
            x = x.reshape((1, lookback, 1))
            x = torch.from_numpy(x)
            x = x.to(torch.float32).to(DEVICE)
            output = model(x)
            prediction_list = np.append(prediction_list, output.cpu().numpy(), axis=0)
        prediction_list = prediction_list[lookback:]
    return prediction_list


def invert(arr):
    with np.errstate(divide='ignore'):
        inverse_array = 1 / arr
        inverse_array[arr == 0] = np.inf
    return inverse_array


def date_forecasts(predictions, historical_rates):
    historical_dates = sorted(historical_rates.keys())
    latest = historical_dates[-1]
    predictions = predictions.ravel().tolist()
    today = pd.to_datetime('today') + pd.Timedelta(days=1)

    future_dates = pd.date_range(start=today, periods=NUM_FORECASTED_DAYS, freq=BDay()).tolist()

    preds_with_dates = {}
    for i, pred in enumerate(predictions):
        future_date = future_dates[i]
        future_date = future_date.strftime('%Y-%m-%d')
        preds_with_dates[future_date] = pred
    
    preds_with_dates[latest] = historical_rates[latest]
    return preds_with_dates


def format_input_data(historical_rates, is_inverted):
    input_data = [historical_rates[k] for k in sorted(historical_rates.keys())]
    lookback = len(input_data)
    input_data = np.array(input_data)

    if is_inverted:
        input_data = invert(input_data)
    return input_data, lookback


def get_fx_forecast(from_currency, to_currency, historical_rates):
    model_path, is_inverted = get_model_path(from_currency, to_currency)

    if model_path is None:
        return {}

    model = instantiate_model_w_weights(model_path)
    input_data, lookback = format_input_data(historical_rates, is_inverted)
    
    predictions = forecast_future_sequence(NUM_FORECASTED_DAYS, model, input_data, lookback)
    if is_inverted:
        predictions = invert(predictions)
    
    formatted_predictions = date_forecasts(predictions, historical_rates)
    return formatted_predictions
