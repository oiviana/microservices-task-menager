import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.css'
import reportWebVitals from './reportWebVitals'

const rootElement = document.getElementById('app')

if (rootElement && !rootElement.innerHTML) {
  ReactDOM.createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}

reportWebVitals()
