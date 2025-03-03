// import React from 'react';
// import ReactDom from 'react-dom/client';
// import App from './App';
// import { BrowserRouter } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'react-toastify/dist/ReactToastify.css';
// import "video-react/dist/video-react.css";

// import { WebSocketProvider } from "./Context/WebSocketProvider";


// const root = ReactDom.createRoot(document.getElementById('root'));


// root.render(

//     <React.StrictMode>
//         <BrowserRouter>
//             <WebSocketProvider>
//                 <App />
//             </WebSocketProvider>
//         </BrowserRouter>
//     </React.StrictMode>

// );


import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import "video-react/dist/video-react.css";
import { WebSocketProvider } from "./Context/WebSocketProvider";

// Service Worker Registration
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("/service-worker.js")
            .then((registration) => {
                console.log("Service Worker registered with scope:", registration.scope);
            })
            .catch((err) => {
                console.error("Service Worker registration failed:", err);
            });
    });
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <WebSocketProvider>
                <App />
            </WebSocketProvider>
        </BrowserRouter>
    </React.StrictMode>
);


