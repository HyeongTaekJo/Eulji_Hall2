import { combineReducers,configureStore, } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import reservationReducer from './reservationSlice';
import storage from 'redux-persist/lib/storage';
import { 
  FLUSH, 
  PAUSE, 
  PERSIST, 
  PURGE, 
  REGISTER, 
  REHYDRATE 
} from 'redux-persist/es/constants'; // 올바른 경로로 수정
import { persistReducer, persistStore } from 'redux-persist';


//{/*persist는 새로고침하면 store에 있는 값은 초기화 되는데 스토리지에 넣어놨다가 다시 가져오는 것 */}


export const rootReducer = combineReducers({
    user: userReducer,
    reservation: reservationReducer,
})

const persistConfig = {
    key: 'root',
    storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, REGISTER],
            },
        }),
    devTools: process.env.NODE_ENV !== 'production', // 개발 환경에서만 Redux DevTools 활성화
});

export const persistor = persistStore(store);