import "./globals.css";

import Body from './components/body'
import Spacer from './components/spacer'

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between p-24">
      <div className="title-background">
        <p className="page-title">
          Foreign Exchange Rates & Forecast
        </p>
      </div>
      <Spacer height={'20rem'}/>
      <div>
        <Body/>
      </div>
    </main>
  );
}
