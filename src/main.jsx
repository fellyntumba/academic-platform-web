import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import App from './app/App'
import { ContextUnivProvider } from './featuresAndInfos/ContextUnivProvider' // 👈 AJOUT

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ContextUnivProvider> 
      <App />
    </ContextUnivProvider>
  </StrictMode>,
)
