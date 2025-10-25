import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios'
import './index.css'
import "./styles/style.css";
import "./styles/userstyle.css";
import "./styles/editbooking.css";
import "./styles/bookingList.css";
import './styles/CarsList.css';

// Ensure axios sends cookies for cross-origin auth flows (OAuth session cookie)
axios.defaults.withCredentials = true

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
