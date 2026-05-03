import { App } from './App.ts'
import './index.css';

const app = document.getElementById('app')

if (app) {
    
    app.appendChild(
        App()
    )

}