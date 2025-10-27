import './bootstrap';
import '../css/app.css';
import 'devextreme/dist/css/dx.light.css'; // or dx.material.teal.light.css, etc.
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { BrowserRouter } from 'react-router';

const appName = import.meta.env.VITE_APP_NAME || 'Delfin';

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
