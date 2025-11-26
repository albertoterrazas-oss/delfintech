import { useEffect, useState } from "react";
import { Dialog } from '@headlessui/react';
import { toast } from 'sonner';
import { SquarePen } from 'lucide-react';
import Datatable from "@/Components/Datatable";
import LoadingDiv from "@/Components/LoadingDiv";
import request from "@/utils";

const route = (name, params = {}) => {
    const routeMap = {
        "menus.index": "/api/menus",
        "menus.store": "/api/menus",
        "menus.update": `/api/menus/${params}`,
    };
    return routeMap[name] || `/${name}`;
};

// Validaciones requeridas para el formulario de Menú
const menuValidations = {
    menu_nombre: true,
    menu_url: true,
    estatus: true,
};

// Función DUMMY de validación adaptada para Menús
const validateInputs = (validations, data) => {
    let formErrors = {};

    // Validación de prueba básica:
    if (validations.menu_nombre && !data.menu_nombre?.trim()) formErrors.menu_nombre = 'El nombre del menú es obligatorio.';
    if (validations.menu_url && !data.menu_url?.trim()) formErrors.menu_url = 'La URL es obligatoria.';
    if (validations.estatus && !data.estatus?.trim()) formErrors.estatus = 'El estatus es obligatorio.';

    return { isValid: Object.keys(formErrors).length === 0, errors: formErrors };
};

// Datos de ejemplo para el estado inicial del formulario de Menú
const initialMenuData = {
    menu_id: null,
    menu_nombre: "",
    menu_idPadre: null, // Puede ser null
    menu_url: "",
    menu_tooltip: "",
    estatus: "Activo",
};

// Componente del Formulario de Menú (Modal de Headless UI)
function MenuFormDialog({ isOpen, closeModal, onSubmit, menuToEdit, action, errors, setErrors }) {
    const [menuData, setMenuData] = useState(initialMenuData);
    const [loading, setLoading] = useState(false);
    const [menus2, setMenus2] = useState();

    // Sincroniza los datos al abrir el modal o cambiar el menú a editar
    useEffect(() => {
        if (isOpen) {
            const dataToLoad = menuToEdit
                ? {
                    ...menuToEdit,
                    // Aseguramos valores por defecto para campos que pueden ser null
                    menu_nombre: menuToEdit.menu_nombre || "",
                    menu_idPadre: menuToEdit.menu_idPadre || null,
                    menu_url: menuToEdit.menu_url || "",
                    menu_tooltip: menuToEdit.menu_tooltip || "",
                    estatus: menuToEdit.estatus || "Activo",
                }
                : initialMenuData;
            setMenuData(dataToLoad);
            setErrors({}); // Limpia errores al abrir
        }
    }, [isOpen, menuToEdit]);


    // // Función genérica para manejar los cambios en los inputs
    // const handleChange = (e) => {
    //     const { name, value, type } = e.target;

    //     // Manejo especial para menu_idPadre (debe ser null o un número)
    //     let newValue = value;
    //     if (name === 'menu_idPadre') {
    //         newValue = value === "" ? null : Number(value);
    //     }

    //     //  setPositionData(prevData => ({
    //     //     ...prevData,
    //     //     [name]: type === 'checkbox' ? (checked ? "1" : "0") : value
    //     // }));

    //     setMenuData(prevData => ({
    //         ...prevData,
    //         [name]: type === 'checkbox' ? (checked ? "1" : "0") : value
    //     }));

    //     // Limpiar error al cambiar el campo
    //     if (errors[name]) {
    //         setErrors(prevErrors => {
    //             const newErrors = { ...prevErrors };
    //             delete newErrors[name];
    //             return newErrors;
    //         });
    //     }
    // };

    const handleChange = (e) => {
        // 1. Extraer 'checked' (para checkboxes) junto con 'name', 'value' y 'type'
        const { name, value, type, checked } = e.target;

        let finalValue = value;

        // 2. Manejo especial para menu_idPadre (debe ser null o un número)
        if (name === 'menu_idPadre') {
            // Asignar null si está vacío, o convertir a número
            finalValue = value === "" ? null : Number(value);
        }

        // 3. Manejo especial para checkboxes (convierte boolean a "1" o "0")
        if (type === 'checkbox') {
            finalValue = checked ? "1" : "0";
        }

        // 4. Actualizar el estado con el valor final calculado
        setMenuData(prevData => ({
            ...prevData,
            // Usamos 'finalValue' que ya ha sido procesado para menu_idPadre y checkboxes
            [name]: finalValue
        }));

        // 5. Limpiar error al cambiar el campo (si existe)
        if (errors[name]) {
            setErrors(prevErrors => {
                const newErrors = { ...prevErrors };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        try {
            await onSubmit(menuData);
            closeModal();
        } catch (error) {
            console.error("Error al enviar el formulario:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchdata = async () => {
        const response = await fetch(route("menus.index"));
        const data = await response.json();
        setMenus2([{ menu_id: 0, menu_nombre: "Raiz" }].concat(data))

    };
    useEffect(() => {
        fetchdata();

    }, [])

    const dialogTitle = action === 'create' ? 'Crear Nuevo Elemento de Menú' : 'Editar Elemento de Menú';

    return (
        <Dialog open={isOpen} onClose={closeModal} className="relative z-50">
            {/* Overlay de fondo */}
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

            {/* Contenedor del Modal */}
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl relative">

                    {/* Indicador de carga */}
                    {loading && <LoadingDiv />}

                    <Dialog.Title className="text-2xl font-bold mb-4 text-gray-900 border-b pb-2">
                        {dialogTitle}
                    </Dialog.Title>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                        <div className="space-y-3">
                            {/* Input Nombre */}
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Nombre del Menú: <span className="text-red-500">*</span></span>
                                <input
                                    type="text"
                                    name="menu_nombre"
                                    value={menuData.menu_nombre}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full rounded-md border p-2 text-sm ${errors.menu_nombre ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                                />
                                {errors.menu_nombre && <p className="text-red-500 text-xs mt-1">{errors.menu_nombre}</p>}
                            </label>

                            {/* Input URL */}
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">URL/Ruta: <span className="text-red-500">*</span></span>
                                <input
                                    type="text"
                                    name="menu_url"
                                    value={menuData.menu_url}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full rounded-md border p-2 text-sm ${errors.menu_url ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                                />
                                {errors.menu_url && <p className="text-red-500 text-xs mt-1">{errors.menu_url}</p>}
                            </label>

                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Menu padre: <span className="text-red-500">*</span></span>
                                <select
                                    name="menu"
                                    value={menuData.menu_idPadre || ''}
                                    onChange={(event) => { setMenuData({ ...menuData, menu_idPadre: event.target.value }); }}
                                    className={`mt-1 block w-full rounded-md border p-2 text-sm ${errors.menu_idPadre ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                                >
                                    <option value="" disabled>Selecciona un menu</option>
                                    {/* Usamos (menus2 ?? []) para asegurar que sea un array antes de mapear */}
                                    {(menus2 ?? []).map((menu) => {

                                        // Construye el nombre jerárquico del menú
                                        const nombreJerarquico = `${menu.menu_padre?.menu_padre?.menu_nombre ? '/ ' + menu.menu_padre?.menu_padre?.menu_nombre : ''} ${menu.menu_padre?.menu_nombre ? '/ ' + menu.menu_padre?.menu_nombre : ''} ${'/ ' + menu.menu_nombre}`;

                                        return (
                                            <option
                                                key={menu.menu_id} // Usa el menu_id como key
                                                value={menu.menu_id} // Usa el menu_id como valor
                                            >
                                                {/* Muestra el nombre jerárquico */}
                                                {nombreJerarquico}
                                            </option>
                                        );
                                    })}
                                </select>
                                {errors.menu_idPadre && <p className="text-red-500 text-xs mt-1">{errors.menu_idPadre}</p>}
                            </label>

                            {/* Input Tooltip */}
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Tooltip (Ayuda):</span>
                                <input
                                    type="text"
                                    name="menu_tooltip"
                                    value={menuData.menu_tooltip}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </label>

                            <div className="flex justify-center w-full"> {/* <-- Contenedor agregado y clases de centrado */}
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="estatus"
                                        checked={menuData.estatus == 1} // Usamos == para manejar 1 o '1'
                                        onChange={handleChange}
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Estatus</span>
                                </label>
                            </div>

                        </div>

                        {/* Botones */}
                        <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={loading}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
                            >
                                {loading ? (action === 'create' ? 'Registrando...' : 'Actualizando...') : (action === 'create' ? 'Guardar Menú' : 'Actualizar Menú')}
                            </button>
                        </div>
                    </form>
                </Dialog.Panel>
            </div>
        </Dialog>
    )
}

// ----------------------------------------------------------------------
// Componente principal MENUS
// ----------------------------------------------------------------------

export default function Menus() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [menus, setMenus] = useState([]);
    const [action, setAction] = useState('create');
    const [menuData, setMenuData] = useState(initialMenuData);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    // Funciones de control del modal
    const openCreateModal = () => {
        setAction('create');
        setMenuData(initialMenuData);
        setErrors({});
        setIsDialogOpen(true);
    };

    const openEditModal = (menu) => {
        setAction('edit');
        setMenuData(menu);
        setErrors({});
        setIsDialogOpen(true);
    };

    const closeModal = () => {
        setIsDialogOpen(false);
        setMenuData(initialMenuData);
        setErrors({});
    };

    /**
     * Función que maneja la validación y la petición POST/PUT real.
     */
    const submit = async (data) => {
        setErrors({});

        // 1. VALIDACIÓN
        const validationResult = validateInputs(menuValidations, data);

        if (!validationResult.isValid) {
            setErrors(validationResult.errors);
            toast.error("Por favor, corrige los errores en el formulario.");
            throw new Error("Validation Failed");
        }

        // 2. RUTAS Y MÉTODO
        const isEdit = data.menu_id;
        // La ID que se pasa a route debe ser la del Menú
        const ruta = isEdit
            ? route("menus.update", data.menu_id)
            : route("menus.store");

        const method = isEdit ? "PUT" : "POST";
        const successMessage = isEdit ? "Menú actualizado con éxito." : "Menú creado con éxito.";

        // 3. PETICIÓN (Request)
        try {
            // Nota: Aquí data contiene todos los campos, incluido menu_idPadre (null o número)
            await request(ruta, method, data);

            // 4. POST-ÉXITO
            await getMenus(); // Obtener lista actualizada
            toast.success(successMessage);
        } catch (error) {
            console.error("Error al guardar el menú:", error);
            // Mostrar error más genérico al usuario
            toast.error("Hubo un error al guardar el menú.");
            throw error; // Propagar el error al Dialog para evitar que cierre el modal
        }
    };

    const getMenus = async () => {
        setIsLoading(true);

        try {
            const response = await fetch(route("menus.index"));
            if (!response.ok) throw new Error("Fallo al cargar menús");
            const data = await response.json();
            setMenus(data);
        } catch (error) {
            console.error('Error al obtener los menús:', error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getMenus() // Llamar a getMenus al montar
    }, [])

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">

            <div className="flex justify-between items-center p-3 border-b mb-4">
                <h2 className="text-3xl font-bold text-gray-800">Gestión de Menús </h2>
                <button
                    onClick={openCreateModal}
                    className="flex items-center px-4 py-2 text-base font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 transition duration-150 ease-in-out"
                >
                    + Nuevo Menú
                </button>
            </div>
            {isLoading ? (
                <div className='flex items-center justify-center h-[100%] w-full'> <LoadingDiv /> </div>

            ) : (
                <Datatable
                    data={menus}
                    virtual={true}
                    columns={[
                        {
                            header: "Estatus",
                            accessor: "menu_estatus",
                            // width: '20%',
                            cell: ({ item: { menu_estatus } }) => {
                                const color = String(menu_estatus) === "1"
                                    ? "bg-green-300" // Si es "1"
                                    : "bg-red-300";  // Si NO es "1" (incluyendo "2", "0", null, etc.)

                                return (
                                    <span className={`inline-flex items-center justify-center rounded-full ${color} w-4 h-4`} />
                                );
                            },
                        },
                        { header: 'Nombre', accessor: 'menu_nombre' },
                        { header: 'ID Padre', accessor: 'menu_idPadre' },
                        { header: 'URL', accessor: 'menu_url' },
                        { header: 'Tooltip', accessor: 'menu_tooltip' },
                        {
                            header: "Acciones", accessor: "Acciones", cell: (eprops) => (<>
                                <button
                                    onClick={() => openEditModal(eprops.item)}
                                    className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 transition"
                                >
                                    Editar
                                </button>
                            </>)
                        },
                    ]}
                />
            )}
            {/* Componente Modal de Headless UI */}
            <MenuFormDialog
                isOpen={isDialogOpen}
                closeModal={closeModal}
                onSubmit={submit}
                menuToEdit={menuData}
                action={action}
                errors={errors}
                setErrors={setErrors}
            />

        </div>
    );
}