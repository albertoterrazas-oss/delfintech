import LeftMenu from '@/Components/LeftMenu';
import { Link, Head } from '@inertiajs/react';
import { Suspense, useState } from 'react';
import { Routes } from 'react-router';

export default function Home({ auth }) {
    const [menuSelected, setMenuSelected] = useState('')

    return (
        <>
            <Head title="Welcome" />
            <div className="relative sm:flex sm:justify-center sm:items-center min-h-screen bg-dots-darker bg-center bg-gray-100 dark:bg-dots-lighter dark:bg-gray-900 selection:bg-red-500 selection:text-white">
                {/* <div className="sm:fixed sm:top-0 sm:right-0 p-6 text-end">
                    {auth.user ? (
                        <Link
                            href={route('dashboard')}
                            className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={route('login')}
                                className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                            >
                                Log in
                            </Link>

                            <Link
                                href={route('register')}
                                className="ms-4 font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div> */}
                <div id="page-container">
                    <UserMenusContext.Provider value={{ userMenus, selectedMenu, SetSelectedMenuFunc, loggedUser, state, dispatch }}>
                        {!token && <LoadingDiv />}
                        {token &&
                            <div className={containerClass}>
                                <LeftMenu MenuFunction={MenuFunction} showMenu={showMenu} empresa={empresa} auth={props.auth} />
                                <div className="content sm:overflow-auto md:overflow-hidden">
                                    <Header user={props.auth.user} empresa={empresa} />
                                    <div className="scrollable-content styled-scroll">
                                        <Routes>
                                            {
                                                routes.map((route, index) => (
                                                    <Route key={index} lazy={route.import} path={route.path} element={(
                                                        <Suspense fallback={
                                                            <div className="h-full">
                                                                <LoadingDiv />
                                                            </div>
                                                        }>
                                                            <route.import />
                                                        </Suspense>
                                                    )} />
                                                ))
                                            }
                                        </Routes>
                                    </div>
                                </div>
                            </div>
                        }
                    </UserMenusContext.Provider>
                    <div className="serverhostInfo non-selectable">{props.localServerInfo && props.localServerInfo}</div>
                </div>

            </div>
        </>
    );
}
