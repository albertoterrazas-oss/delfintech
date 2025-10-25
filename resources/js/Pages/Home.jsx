import Header from '@/Components/Header';
import LeftMenu from '@/Components/LeftMenu';
import Loading from '@/Components/Loading';
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
    }
]

export default function Home({ auth, token }) {
    const navigate = useNavigate();
    const location = useLocation();
    const {
        userMenus,
        setUserMenus,
        setLoggedUser,
        setSelectedMenu,
        setSearchMenuTerm,
        setFilteredMenus
    } = useStore()

    const [menuSelected, setMenuSelected] = useState('')
    const [showMenu, setShowMenu] = useState(true)
    const containerClass = showMenu ? "body-container" : "body-container open"

    const MenuFunction = () => {
        setShowMenu(!showMenu);
    };

    const getUserMenus = async () => {
        const response = await fetch(route("user.menus"), {
            method: "POST",
            body: JSON.stringify({ id: auth.user.usuario_idUsuario }),
            headers: { "Content-Type": "application/json" }
        });

        const data = await response.json()
        setUserMenus(data)
    };

    useEffect(() => {
        console.log(userMenus)
        // console.log(token)
        if (!userMenus) {
            getUserMenus();
            setLoggedUser(auth.user);
        }
    }, [userMenus, token]);

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

    useEffect(() => {
        // Verificar si el usuario está autenticado
        if (!auth.user) {
            router.visit('/login');
            return;
        } else {

        }
    }, [auth]);

    // if (!auth.user) return null

    return (
        <div id="page-container">
            <Head title="Welcome" />
            {!auth.user && <Loading />}
            {auth.user &&
                <div className={containerClass}>
                    <LeftMenu MenuFunction={MenuFunction} showMenu={showMenu} auth={auth} />
                    <div className="content sm:overflow-auto md:overflow-hidden">
                        <Header user={auth.user} />
                        <div className="scrollable-content styled-scroll">
                            <Routes>
                                {
                                    routes.map((route, index) => (
                                        <Route key={index} lazy={route.import} path={route.path} element={(
                                            <Suspense fallback={
                                                <div className="h-full">
                                                    <Loading />
                                                </div>
                                            }>
                                                <route.import auth={auth} />
                                            </Suspense>
                                        )} />
                                    ))
                                }
                            </Routes>
                        </div>
                    </div>
                </div>
            }
            {/* <div className="serverhostInfo non-selectable">{props.localServerInfo && props.localServerInfo}</div> */}
        </div>
    );
}
