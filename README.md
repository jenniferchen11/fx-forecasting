This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## About

Foreign exchange rate forecaster, providing 14-day bilateral currency rate predictions for ~10 currencies. 
<img width="1630" alt="fx_forecast_demo_pic" src="https://github.com/jenniferchen11/fx-forecasting/assets/33589920/434b669f-8a9e-4644-be25-46991ef84a6b">

### Frontend
- Built using Next.js and Tailwind CSS
- Deployed using Vercel, check it out here: [https://fx-forecasting.vercel.app/](https://fx-forecasting.vercel.app/)

### Backend
- The API exists in a separate repo: [https://github.com/jenniferchen11/fx-forecasting-api](https://github.com/jenniferchen11/fx-forecasting-api)
- Built using Flask and MongoDB
- Deployed using [render.com](https://render.com/) 
- Uses LSTM model that was trained using this code: [https://github.com/jenniferchen11/fx-forecasting-api/blob/main/training/rnn_model_training.ipynb](https://github.com/jenniferchen11/fx-forecasting-api/blob/main/training/rnn_model_training.ipynb)


## Currently Working On
- Re-starting model training, this time after collecting more data so that there are more features

## Getting Started

1. Clone the repo and install dependencies
```bash
git clone https://github.com/jenniferchen11/fx-forecasting.git
cd fx-forecasting
npm install
```
2. Clone the backend repo and install dependencies
```bash
git clone https://github.com/jenniferchen11/fx-forecasting-api.git
cd fx-forecasting-api
pip install -r requirements.txt
```
3. Run the backend service
```bash
python index.py
```
4. Run the development server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
