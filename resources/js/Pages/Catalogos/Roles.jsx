import AsignMenusDialog from "./Roles/AsignMenusDialog";
import request from "@/utils";
// import DialogComp from "@/components/DialogComp";

import "../../../../resources/sass/TablesComponent/_tablesStyle.scss";

import LoadingDiv from "@/components/LoadingDiv";
import Datatable from "@/components/Datatable";
import { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import { Dialog, DialogPanel, DialogTitle, Transition } from '@headlessui/react'; // 🌟 Changed from @mui/material
// import { Tree } from 'primereact/tree';

const rolesValidation = { roles_descripcion: ['required', 'max:150'] }
const rolesData = { roles_descripcion: "" }

export const ROLES_MONITOR = {
    VENTAS: 7025,
    SERV_TEC: 10029,
}

export default function Roles() {
    const [state, setState] = useState(true)
    const [open, setOpen] = useState(false);
    const [action, setAction] = useState("create");
    const [roles, setRoles] = useState();
    const [assignMenu, setAssignMenu] = useState(false);
    const [rol_idRol, setRol_idRol] = useState(0);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const { data, setData } = useForm(rolesData);

    const fetchdata = async () => {
        const response = await fetch(route("roles.index"));
        const data = await response.json();
        setRoles(data);
    };

    useEffect(() => {
        fetchdata().then(() => setLoading(false));
    }, []);

    const submit = async (e) => {
        e.preventDefault();

        setErrors({})
        const result = validateInputs(rolesValidation, data)
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }

        const ruta = action === "create" ? route("roles.store") : route("roles.update", rol_idRol);
        const method = action === "create" ? "POST" : "PUT";
        await request(ruta, method, data).then(() => {
            fetchdata();
            setOpen(false); // Changed from !open to false for explicit closing
        });
    };
    const handleCloseModal = () => {
        setOpen(false);
        setErrors({});
    };
    
    // 💡 Tooltip is not available in Headless UI, so I've removed the MUI Tooltip wrapper 
    // and kept the button's title attribute for accessibility and basic hovering.

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {loading && <LoadingDiv />}
            {roles && !loading && (
                <div className='sm:h-[97%] md:h-[90%]'>
                    <div className="w-full pt-3 monitor-table overflow-y-auto blue-scroll">

                        <Datatable
                            add={() => {
                                setAction("create");
                                setData(rolesData);
                                setOpen(true);
                            }}
                            virtual={true}
                            data={roles}
                            columns={[
                                { header: "Nombre",width:'70%', accessor: "roles_descripcion", type: 'text' },
                                {
                                    header: "Acciones",width:'30%',
                                    cell: (eprops) => (
                                        <>
                                            {/* Removed MUI Tooltip and added a title attribute */}
                                            <button
                                                className="material-icons"
                                                title="Editar" 
                                                onClick={() => {
                                                    setAction("edit");
                                                    setData({ ...eprops.item });
                                                    setOpen(true);
                                                    setRol_idRol(
                                                        eprops.item.roles_id
                                                    );
                                                }}
                                            >
                                                edit
                                            </button>
                                            
                                            {/* Removed MUI Tooltip and added a title attribute */}
                                            <button
                                                onClick={() => {
                                                    setAssignMenu(true);
                                                    setData({ ...eprops.item });
                                                }}
                                                className="material-icons"
                                                title="Asignar Menus"
                                            >
                                                engineering
                                            </button>
                                        </>
                                    ),
                                },
                            ]}
                        />
                    </div>
                </div>
            )}

            <AsignMenusDialog
                assignMenu={assignMenu}
                assignMenuHandler={setAssignMenu}
                rol={data}
            ></AsignMenusDialog>

            {/* DialogComp remains, but if it was relying on MUI Dialog internally, 
            it will need a separate refactor. Assuming it's a wrapper for a modal. */}
            {/* <DialogComp
                dialogProps={{
                    model: 'rol',
                    width: 'sm',
                    openState: open,
                    actionState: action,
                    openStateHandler: () => handleCloseModal(),
                    onSubmitState: submit
                }}
                fields={[
                    {
                        label: "Nombre",
                        input: true,
                        type: "text",
                        fieldKey: "roles_descripcion",
                        value: data.roles_descripcion,
                        autoComplete: "Nombre",
                        isFocused: true,
                        onChangeFunc: (e) =>
                            setData({
                                ...data,
                                roles_descripcion: e.target.value,
                            }),
                    },
                ]}
                errors={errors}
            /> */}
        </div>
    );
}