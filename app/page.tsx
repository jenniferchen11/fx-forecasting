import "./globals.css";
import Body from './components/body'
import React, { useState } from 'react';

export default function Home() {
  return (
    <main className="flex min-h-[55vh] flex-col items-center justify-between p-24">
      <div className="title-background">
        <p className="page-title">
          ForEx Rates & Forecast
        </p>
      </div>
      <div>
        <Body/>
      </div>
    </main>
  );
}
