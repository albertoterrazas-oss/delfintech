import Header from '@/Components/Header';
import LeftMenu from '@/Components/LeftMenu';
import Loading from '@/Components/LoadingDiv';
import useStore from '@/Stores/useStore'
import { Link, Head, router } from '@inertiajs/react';
import { lazy, Suspense, useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router';
import '../../sass/_scrollableContentStyle.scss'
import { findMenuByUrl, normalizeUrl } from '@/utils';

const routes = [
    {
        path: "/",
        import: lazy(() => import('./Dashboard'))
    },
    {
        path: "/dashboard",
        import: lazy(() => import('./Dashboard'))
    },
    {
        path: "/unidades",
        import: lazy(() => import('./Catalogos/Unidades'))
    },
    {
        path: "/usuarios",
        import: lazy(() => import('./Catalogos/Usuarios'))
    },
    {
        path: "/motivos",
        import: lazy(() => import('./Catalogos/Motivos'))
    },
    {
        path: "/destino",
        import: lazy(() => import('./Catalogos/Destinos'))
    },

    {
        path: "/reportes",
        import: lazy(() => import('./Catalogos/Reportes'))
    },
    {
        path: "/registrosalida",
        import: lazy(() => import('./Catalogos/RegistroYSalidaUnificado'))
    },
    {
        path: "/menus",
        import: lazy(() => import('./Catalogos/Menus'))
    },

    {
        path: "/listaverificacion",
        import: lazy(() => import('./Catalogos/ListaVerificacion'))
    },

    {
        path: "/puestos",
        import: lazy(() => import('./Catalogos/Puestos'))
    },
    {
        path: "/departamentos",
        import: lazy(() => import('./Catalogos/Departamentos'))
    },
    {
        path: "/QuienConQuienTransporte",
        import: lazy(() => import('./Catalogos/QuienConQuienTransporte'))
    },
    {
        path: "/roles",
        import: lazy(() => import('./Catalogos/Roles'))
    },
    {
        path: "/correosnotificaciones",
        import: lazy(() => import('./Catalogos/Correos'))
    },



    


]

export default function Home({ auth, token }) {
    const navigate = useNavigate();
    const location = useLocation();
    const {
        loggedUser,
        userMenus,
        showMenu,
        searchMenuTerm,
        setUserMenus,
        setLoggedUser,
        setSelectedMenu,
        setFilteredMenus
    } = useStore()

    const [menuSelected, setMenuSelected] = useState('')
    // const [showMenu, setShowMenu] = useState(true)
    const containerClass = showMenu ? "body-container" : "body-container open"

    const getUserMenus = async () => {
        const response = await fetch(route("user.menus"), {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        const data = await response.json()
        setUserMenus(data)
    };
    useEffect(() => {
        // If 'auth' is falsy (meaning the user is NOT authenticated)
        if (!auth) {
            // Use 'navigate' or 'router.visit' depending on your setup
            // Since you are using 'router.visit', we'll stick with that
            router.visit('/login');
        }
        // The dependency array should include 'auth' and 'router'
        // so the check runs whenever the auth status might change.
    }, [auth, router]);



    console.log('Auth Props:', auth);
    console.log('token Props:', token);

    useEffect(() => {
        // Only run if the token has a value to avoid saving 'undefined' or 'null'
        if (token) {
            console.log('Saving token to localStorage:', token);
            // Save the token to localStorage under a key (e.g., 'authToken')
            localStorage.setItem('token', token);
        } else {
            console.log('Token is falsy, removing from localStorage.');
            // Optionally remove the token if it becomes null, undefined, or an empty string
            localStorage.removeItem('authToken');
            router.visit('/login');
        }
    }, [token]);


    useEffect(() => {
        localStorage.setItem('auth', JSON.stringify(auth));
        setLoggedUser(auth.Personas_usuarioID);
    }, [auth, setLoggedUser]);

    const filterMenus = (menuList, calc = []) => {
        const regex = new RegExp(state.searchMenuTerm.replace(/[^a-zA-ZÑñ\s]/g, '').toLowerCase(), 'u');
        const obj = {}
        menuList.forEach(menu => {
            if (menu.childs && menu.childs.length > 0) {
                filterMenus(menu.childs, calc);
            } else {
                const objKeys = Object.keys(menu);
                const child = {};

                for (const key of objKeys) {
                    child[key] = menu[key];
                }

                if (child.menu_nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").match(regex)) {
                    calc.push(child);
                }
            }
        });
        return calc
    };

    useEffect(() => {
        // console.log(loggedUser)
        // console.log(token)
        if (!userMenus) {
            getUserMenus();
            // setLoggedUser(localStorage.getItem('userId'));
        }
    }, [userMenus, loggedUser]);

    useEffect(() => {
        if (searchMenuTerm !== '' && searchMenuTerm) {
            const filtered = filterMenus(userMenus)
            setFilteredMenus(filtered);
            // dispatch({ type: 'SET_FILTERED_MENUS', payload: filtered })
            // setFilteredMenus(filtered);
        } else {
            setFilteredMenus(userMenus);
            // dispatch({ type: 'SET_FILTERED_MENUS', payload: userMenus })
            // setFilteredMenus(userMenus);
        }
    }, [searchMenuTerm, userMenus]);

    useEffect(() => {
        if (userMenus) {
            const savedMenu = localStorage.getItem("selectedMenu")
            const pathname = normalizeUrl(location.pathname)

            let selected = savedMenu ? JSON.parse(savedMenu) : null

            if (!selected || selected.menu_url !== pathname) {
                const matched = findMenuByUrl(userMenus, pathname)
                if (matched) {
                    setSelectedMenu(matched)
                    localStorage.setItem("selectedMenu", JSON.stringify(matched))
                } else {
                    setSelectedMenu(null)
                    localStorage.removeItem("selectedMenu")
                }
            } else {
                setSelectedMenu(selected)
            }
        }
        localStorage.setItem('lastPath', location.pathname);
    }, [userMenus, location.pathname])



    // if (!auth.user) return null

    return (
        <div id="page-container">
            <Head title="Delfin tecnologias" />
            {!loggedUser && <Loading />}
            {/* <h2>HOLA EDGAR</h2> */}
            {loggedUser &&
                <div className={containerClass}>
                    <LeftMenu auth={loggedUser} />
                    <div className="content sm:overflow-auto md:overflow-hidden  ">{/* blue-scroll */}
                        <Header user={loggedUser} />
                        <div className="scrollable-content styled-scroll">
                            {/* <div className='relative h-[100%] pb-4 px-3 overflow-auto'> */}
                            <Routes>
                                {
                                    routes.map((route, index) => (
                                        <Route key={index} lazy={route.import} path={route.path} element={(
                                            <Suspense fallback={
                                                <div className="h-full">
                                                    <Loading />
                                                </div>
                                            }>
                                                <route.import auth={loggedUser} />
                                            </Suspense>
                                        )} />
                                    ))
                                }
                            </Routes>
                            {/* </div> */}
                        </div>
                    </div>
                </div>
            }
            {/* <div className="serverhostInfo non-selectable">{props.localServerInfo && props.localServerInfo}</div> */}
        </div>
    );
}
