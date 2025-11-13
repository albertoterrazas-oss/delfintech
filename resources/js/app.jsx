import './bootstrap';
import '../css/app.css';
// import 'devextreme/dist/css/dx.light.css'; // or dx.material.teal.light.css, etc.
import { createRoot } from 'react-dom/client';
import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { BrowserRouter } from 'react-router';
import axios from 'axios';

const appName = import.meta.env.VITE_APP_NAME || 'Delfin';
const appUrl = import.meta.env.VITE_API_URL;

// function SyncProvider({ children }) {
//     useEffect(() => {
//         const channel = new BroadcastChannel("sync-channel");

//         channel.onmessage = (event) => {
//             // if (event.data.type === "cambioEmpresa") {
//             //     setTimeout(() => {
//             //         window.location.reload();
//             //     }, 805);
//             // }
//             if (event.data.type === "logout") {
//                 localStorage.clear();
//                 window.location.href = "/login";
//             }
//             if (event.data.type === "login") {
//                 setTimeout(() => {
//                     window.location.reload();
//                 }, 805);
//             }
//         };

//         return () => channel.close();
//     }, []);

//     return children;
// }

// const { fetch: originalFetch } = window;
// window.fetch = async (...args) => {
//     const token = localStorage.getItem('authToken');
//     console.log('token', token);

//     let [resource, config] = args;

//     const response = await originalFetch(resource, {
//         ...config,
//         headers: {
//             ...(config?.headers || {}),
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//         },
//     });

//     if (response.status === 599) {
//         if (!error) {
//             // noty('Sesión terminada', 'error');
//             error = true;
//             setTimeout(() => {
//                 const logout = document.getElementById('logoutButton');
//                 logout.click();
//             }, 2000);
//         }
//     }

//     return response;
// };

axios.defaults.baseURL = appUrl;
axios.defaults.withCredentials = true;

axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('authToken');
            router.visit('/login');
        }
        return Promise.reject(error);
    }
);

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <BrowserRouter>
                <App {...props} />
            </BrowserRouter>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
