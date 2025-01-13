import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "@department-of-veterans-affairs/component-library/dist/main.css";
import App from './App.tsx'
import { defineCustomElements } from '@department-of-veterans-affairs/web-components/loader'

defineCustomElements();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>
)
