import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);


// import React from 'react';
// import { createRoot } from 'react-dom/client';
// import { BrowserRouter } from 'react-router-dom'; // 1. Import BrowserRouter
// import App from './App.tsx';
// import './index.css';

// createRoot(document.getElementById("root")!).render(
//   <React.StrictMode>
//     <BrowserRouter> {/* 2. Wrap your App component */}
//       <App />
//     </BrowserRouter>
//   </React.StrictMode>
// );