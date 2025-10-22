import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../sass/MenusComponent/_leftMenu.scss";
import { useContext } from "react";
import UserMenusContext from "@/Context/UserMenusContext";
import LogoutIcon from '../../png/logoutIcon.png';
import { useForm } from "@inertiajs/react";
import request from "@/utils";
import SearchIcon from '@mui/icons-material/Search';
import * as Icons from "@mui/icons-material";

const LeftMenu = (props) => {
    const menuClass = props.showMenu ? "leftmenu open" : "leftmenu close";
    const [activeMenu, setActiveMenu] = useState("");
    const [activeMenu2, setActiveMenu2] = useState("");
    const [activeMenu3, setActiveMenu3] = useState("");
    const { selectedMenu, SetSelectedMenuFunc, state, dispatch } = useContext(UserMenusContext);
    const [empresas, setEmpresas] = useState();
    const [imageLoaded, setImageLoaded] = useState(false);
    const [open, setOpen] = useState(false);

    const menuSearcherRef = useRef()
    const menuSearcherIconRef = useRef()
    const [isInputFocused, setIsInputFocused] = useState(false);
    const navigate = useNavigate();
    const { post } = useForm();
    const savedColor = localStorage.getItem('COLORMENU') || '#2F0F0F';
    const [user, setUser] = useState();
    const [states, setState] = useState({ empresa: '', centro: '' });
    const [color, setColor] = useState('#FFFFFF');

    const GetUser = async () => {
        const response = await fetch(route("profileUser"));
        const data = await response.json();
        setUser(data);
    };

    const logout = (e) => {
        const keysToRemove = ['empresaData', 'title', 'token'];
        keysToRemove.forEach(key => localStorage.removeItem(key));
        const channel = new BroadcastChannel("sync-channel");
        channel.postMessage({ type: "logout" });
        channel.close();
        post(route('logout'));
    };

    const ClickMenu = async (id) => {
        try {
            const res = await fetch(route('MenuClick'), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            });
            if (res.ok);
        } catch (err) {
            console.error("Error al registrar clic:", err);
        }
    };

    const setPageTitle = (menu1, menu2 = '', menu3 = '') => {
        const title = {
            menu1: menu1,
            menu2: menu2,
            menu3: menu3,
        }
        localStorage.setItem('title', JSON.stringify(title))
    }

    function renderMenu(menu, selectedMenu) {
        const handleClick = (menu) => {
            if (typeof menu !== "string") {
                SetSelectedMenuFunc(menu);
                setPageTitle(menu.menu_nombre);
                localStorage.setItem("selectedMenu", JSON.stringify(menu))
                // console.log("selectedMenu", JSON.stringify(menu.menu_id));
                ClickMenu(JSON.stringify(menu.menu_id));
            }
        };

        const renderTooltipIcon = (tooltip) => {
            // Verifica si el ícono existe en Icons
            const IconComponent = tooltip && tooltip !== "-" && Icons[tooltip];
            return IconComponent ? <IconComponent /> : null; // Si existe el ícono, lo renderiza
        };

        return (
            <React.Fragment>
                {menu.childs && menu.childs.length !== 0 ? (
                    <div className={`leftmenu-item accordion`} onClick={() => handleClick(menu.menu_nombre)}>
                        <a className="text-white ">
                            {renderTooltipIcon(menu.menu_tooltip) && <span className="mr-1 w-6 h-6 ">{renderTooltipIcon(menu.menu_tooltip)}</span>}
                            {menu.menu_nombre}
                        </a>
                    </div>
                ) : (
                    <Link
                        to={menu.menu_url}
                        onClick={() => handleClick(menu)}
                        className={`leftmenu-item ${selectedMenu?.menu_nombre === menu.menu_nombre ? "item-selected" : ""}`}
                    >
                        <span className="flex relative items-center text-white">
                            {renderTooltipIcon(menu.menu_tooltip) && <span className="mr-2 w-6 h-6">{renderTooltipIcon(menu.menu_tooltip)}</span>}
                            {menu.menu_nombre}
                        </span>

                        {state.selectedMenu?.menu_nombre === menu.menu_nombre && (
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 32 32"
                                xmlns="http://www.w3.org/2000/svg"
                                className="absolute -left-8 top-1/2 transform -translate-y-1/2"
                            >
                                <path
                                    d="M10 8 L24 16 L10 24 Z"
                                    fill={`${color}`}
                                    style={{ background: color }}
                                />
                            </svg>
                        )}
                    </Link>

                )}

                {menu.childs && menu.childs.length !== 0 && (
                    <div className="submenu-panel">
                        <ul className="leftmenu-list">
                            {menu.childs.map((submenu, index2) => (
                                <li key={index2}>
                                    {renderMenu(submenu, selectedMenu)}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </React.Fragment>
        );

    }

    useEffect(() => {
        if (!user) {
            GetUser(); // si no hay usuario, lo solicita
        } else if (user.usuario_idCentroCostos) {
            // si ya hay usuario y tiene centro de costos, lo guarda
            localStorage.setItem("CC", user.usuario_idCentroCostos);
        }
    }, [user]); // se ejecuta cuando cambia `user`



    useEffect(() => {
        if (state.filteredMenus) {
            const handleClick = function () {
                const subPanel = this.nextElementSibling;
                if (activeMenu === this) {
                    this.classList.remove("active");
                    subPanel.style.maxHeight = null;
                    setActiveMenu(null);
                } else {
                    if (activeMenu) {
                        activeMenu.classList.remove("active");
                        subPanel.style.maxHeight = null;
                        // activeMenu.nextElementSibling.style.maxHeight = null;
                    }
                    this.classList.add("active");
                    subPanel.style.maxHeight = subPanel.scrollHeight + "vh";
                    setActiveMenu(this);
                }
            };
            const handleClick2 = function () {
                const subPanel = this.nextElementSibling;
                if (activeMenu2 === this) {
                    this.classList.remove("active2");
                    subPanel.style.maxHeight = null;
                    setActiveMenu2(null);
                } else {
                    if (activeMenu2) {
                        activeMenu2.classList.remove("active2");
                        subPanel.style.maxHeight = null;
                        // activeMenu.nextElementSibling.style.maxHeight = null;
                    }
                    this.classList.add("active2");
                    subPanel.style.maxHeight = subPanel.scrollHeight + "vh";
                    setActiveMenu2(this);
                }
            };
            const handleClick3 = function () {
                const subPanel = this.nextElementSibling;
                if (activeMenu3 === this) {
                    this.classList.remove("active3");
                    subPanel.style.maxHeight = null;
                    setActiveMenu3(null);
                } else {
                    if (activeMenu3) {
                        activeMenu3.classList.remove("active3");
                        // activeMenu.nextElementSibling.style.maxHeight = null;
                        subPanel.style.maxHeight = null;
                    }
                    this.classList.add("active3");
                    subPanel.style.maxHeight = subPanel.scrollHeight + "vh";
                    setActiveMenu3(this);
                }
            };

            const accordions = document.querySelectorAll(".accordion");
            accordions.forEach((accordion) => {
                accordion.addEventListener("click", handleClick);
            });
            const accordions2 = document.querySelectorAll(".accordion2");
            accordions2.forEach((accordion) => {
                accordion.addEventListener("click", handleClick2);
            });
            const accordions3 = document.querySelectorAll(".accordion3");
            accordions3.forEach((accordion) => {
                accordion.addEventListener("click", handleClick3);
            });

            return () => {
                accordions.forEach((accordion) => {
                    accordion.removeEventListener("click", handleClick);
                });
                accordions2.forEach((accordion) => {
                    accordion.removeEventListener("click", handleClick2);
                });
                accordions3.forEach((accordion) => {
                    accordion.removeEventListener("click", handleClick3);
                });
            };
        }
    }, [state.filteredMenus, activeMenu, activeMenu2, activeMenu3, SetSelectedMenuFunc]);

    useEffect(() => {
        if (empresas) {
            setCambioEmpresasCard(empresas.map(empresas => (
                <div key={empresas.id} className="optEmpresa" >
                    <img src={`data:image/png;base64,${empresas.empresa_Logotipo}`} alt="" />
                    <p>{empresas.empresa_razonSocial}</p>
                </div>
            )));
        }
    }, [!empresas]);



    return (
        <div id="left-menu" className={menuClass} style={{ backgroundColor: savedColor }}>
            <div className="flex flex-col h-[100svh]">
                <div className="headerMenu pt-4 pl-7 pr-7 border-b-2 border-[#d1d1d117]">
                    <div className="user-info">

                        <div className="flex items-center gap-4">
                            <div className="relative w-12 h-12">
                                {!imageLoaded && (
                                    <div className="absolute inset-0 w-12 h-12 rounded-full bg-gray-300 animate-pulse"></div>
                                )}
                                <img
                                    alt=""
                                    src={user?.imagen ? `data:image/png;base64,${user.imagen}` : "https://via.placeholder.com/150"}
                                    className={`absolute inset-0 w-12 h-12 rounded-full object-cover transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"
                                        }`}
                                    onLoad={() => setImageLoaded(true)}
                                />
                                <span
                                    className={`absolute bottom-0 left-8 w-3.5 h-3.5 border-2 border-white dark:border-white-800 rounded-full 
                                                ${user?.usuario_estatus === "1" ? "bg-green-400" : "bg-red-400"}`}
                                ></span>
                            </div>

                            <div>
                                <h3 className="text-[9px] w-24 overflow-hidden text-ellipsis whitespace-nowrap" title={props.auth.user ? props.auth.user.usuario_nombre : ""}>
                                    {props.auth.user ? props.auth.user.usuario_nombre : <div className="w-24 h-4 bg-gray-300 animate-pulse" />}
                                </h3>

                                <div className="flow-root">
                                    <ul className="-m-1 flex flex-wrap">
                                        <li className="p-1 leading-none">
                                            <a className="text-[#fcfcfc] text-[14px] truncate">
                                                {props.auth.user ? props.auth.user.usuario_username :
                                                    <div className="w-36 h-4 bg-gray-300 animate-pulse" />
                                                }
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                        </div>

                    </div>
                    <div className="flex items-center justify-center">
                        <div className="leftmenu-button cursor-pointer">
                            <button className="w-full h-full" onClick={props.MenuFunction}>

                                {props.showMenu == true ?
                                    <svg viewBox="0 0 42 30" className="w-full h-10">
                                        <path
                                            d="M20 24L13 16L20 8M16 16H35"
                                            fill="none"
                                            stroke={`${color}`}
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg> :
                                    <svg viewBox="0 0 64 64" className="w-12 h-10">
                                        <path
                                            d="M12 28h42a3 3 0 0 1 0 6h-42a3 3 0 0 1 0-6zM12 42h42a3 3 0 0 1 0 6h-42a3 3 0 0 1 0-6z"
                                            fill={`${color}`}
                                        />
                                    </svg>
                                }
                            </button>
                        </div>
                    </div>
                </div>
                <div className='relative pt-2'>
                    <div className='flex justify-end min-h-[3rem] mr-5 mt-2 mb-3'>
                        <input
                            ref={menuSearcherRef}
                            id="search-input-leftmenu"
                            className={`search-input-leftmenu ${isInputFocused ? 'focused' : ''}`}
                            type="text"
                            value={state.searchMenuTerm}
                            onChange={e => { dispatch({ type: 'SET_SEARCH_MENU_TERM', payload: e.target.value }) }}
                            onFocus={() => setIsInputFocused(true)}
                            onBlur={() => setIsInputFocused(false)}
                        />
                        <label htmlFor="search-input-leftmenu" className='non-selectable'><SearchIcon ref={menuSearcherIconRef} className={`search-icon-leftmenu ${isInputFocused ? 'focused' : ''}`} /></label>
                    </div>
                </div>
                <div className="containerMenu grow pt-1 blue-scroll" >
                    <ul id="menus-list" className="leftmenu-list">
                        {state.filteredMenus && state.filteredMenus.length > 0 &&
                            state.filteredMenus.map((menu, index) => (
                                <li key={index}>
                                    {renderMenu(menu, selectedMenu)}
                                </li>
                            ))}
                    </ul>
                </div>
                <div className="footerMenu border-t-2 border-[#d1d1d117]">
                    <div
                        className={`text-white ${user?.roles_descripcion === "CLIENTE-FACTURACION"
                            ? "pointer-events-none opacity-50"
                            : ""
                            }`}
                    >
                        <p className="text-[12px]">
                            EMPRESA :
                            <span
                                className="cursor-pointer select-none"
                                style={{ color: color }}
                                onClick={() => setOpen(!open)}
                            >
                                {props.empresa.empresa}
                            </span>
                        </p>
                        <p className="text-[12px]">
                            C.COSTOS :
                            <span
                                className="cursor-pointer select-none"
                                onClick={() => setOpen(!open)}
                            >
                                {centroLogged}
                            </span>
                        </p>
                    </div>

                    <div className="flex flex-col justify-between gap-2 items-center logout-button transition-all duration-300 ease-in-out shadow-lg hover:scale-110">
                        <img
                            id="logoutButton"
                            src={LogoutIcon}
                            onClick={(e) => logout()}
                            className="w-[30px] h-[30px] cursor-pointer clickeableItem"
                        />
                    </div>
                </div>

            </div>

        </div >
    );
};

export default LeftMenu;




