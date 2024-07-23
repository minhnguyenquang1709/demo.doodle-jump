import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { StoreProvider } from 'easy-peasy';
import {store} from './store.tsx'; // bind store to the react app

ReactDOM.createRoot(document.getElementById('root')!).render(
    <App />
)