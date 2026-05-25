import { App } from './App';
import './index.css';

const app = document.getElementById('app');

if (app) {
    
    app.appendChild(
        App()
    )

}