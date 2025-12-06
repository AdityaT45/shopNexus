import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AppProvider } from './context/AppContext.jsx'; 
import { AdminProvider } from './context/AdminContext.jsx';
import { BrowserRouter as Router } from 'react-router-dom';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { BannerProvider } from './context/BannerContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
        <AppProvider> 
          <AdminProvider>
            <BannerProvider>
                <App />
                </BannerProvider>
                </AdminProvider>
            </AppProvider>
    </Router>
  </StrictMode>
)
