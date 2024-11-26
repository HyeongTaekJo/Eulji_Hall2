import React from 'react';
import ReactDOM from 'react-dom/client';
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter} from 'react-router-dom';
import { Provider } from 'react-redux';
import {persistor, store} from './store';
import { PersistGate } from 'redux-persist/es/integration/react'



createRoot(document.getElementById('root')).render(
  <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
    <Provider store = {store}>
        <PersistGate loading={null} persistor={persistor}> 
           <App />     {/*PersistGate는 스토리지에 있는 값을 가져오기 전까지 화면을 지연시키는 것 */}
        </PersistGate>
      </Provider>
  </BrowserRouter>
)
