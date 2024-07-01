This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## About

Foreign exchange rate forecaster, providing 14-day bilateral currency rate predictions for ~10 currencies. 

### Frontend
- Built using Next.js and Tailwind CSS
- Deployed using Vercel, check it out here: [https://fx-forecasting.vercel.app/](https://fx-forecasting.vercel.app/)

### Backend
- The API exists in a separate repo: [https://github.com/jenniferchen11/fx-forecasting-api](https://github.com/jenniferchen11/fx-forecasting-api)
- Built using Flask and MongoDB
- Deployed using render.com 
- Uses LSTM model that was trained using this code: [https://github.com/jenniferchen11/fx-forecasting-api/blob/main/training/rnn_model_training.ipynb](https://github.com/jenniferchen11/fx-forecasting-api/blob/main/training/rnn_model_training.ipynb)


## Currently Working On
- Re-starting model training, this time after collecting more data so that there are more features

## Getting Started

1. Clone the repo
```bash
git clone https://github.com/jenniferchen11/fx-forecasting.git
```
2. Run the development server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
