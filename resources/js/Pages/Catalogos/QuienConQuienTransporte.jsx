// import { ButtonComp } from "@/components/ButtonComp";
import Datatable from "@/components/Datatable";
import LoadingDiv from "@/components/LoadingDiv";
import request from "@/utils";
import { Button } from "devextreme-react";
import { useEffect, useState } from "react";

export default function QuienConQuienTransporte() {
    const [modData, setModData] = useState([]);
    const [states, setStates] = useState({
        loading: true,
        open: false,
        choferes: [],
        destinos: [],
        motivos: [],
        // configuraciones: [],
        quienConQuien: [],
        tipo: ''
    });


    const getWho = async () => {
        const [
            unidades,
            destinos,
            motivos,
            choferes,
            Qconquien
        ] = await Promise.all([
            request(route('unidades.index')),
            request(route('destinos.index')),
            request(route('motivos.index')),
            request(route('users.index')),
            request(route('QuienconQuienUnidades')),


        ]);

        setStates(prev => ({
            ...prev,
            quienConQuien: Qconquien,
            motivos: motivos,
            destinos: destinos,
            choferes: choferes,
            loading: false,
        }));
    };



    const processWhoEquals = (who = {}, whoData = states.quienConQuien) => {
        const unSavedWho = []; // aquí puedes implementar tu lógica real
        const unsavedWhoIds = unSavedWho.map(reg => reg.CUA_unidadID);

        // NUEVO CÓDIGO
        const newWhoByWhoData = whoData.map(reg => {
            // Extrae 'quienConQuien_checkout' y la ignora.
            // 'restOfReg' contiene todas las otras propiedades de 'reg'.
            const { quienConQuien_checkout, ...restOfReg } = reg;

            // Devuelve el nuevo objeto sin la propiedad excluida.
            return restOfReg;
        });
        const whoIndex = newWhoByWhoData.findIndex(q => q.CUA_unidadID == who.CUA_unidadID);
        if (whoIndex !== -1) {
            newWhoByWhoData[whoIndex] = who;
        }

        return {
            newModData: [
                ...modData.filter(q => !unsavedWhoIds.includes(q.CUA_unidadID) && q.CUA_unidadID !== who.CUA_unidadID),
                ...unSavedWho,
                who
            ],
            unsavedWhoIds,
            newWhoByWhoData
        };
    };

    const updateWhoRow = (e) => {
        if (e.newData) {
            const newData = { ...e.oldData, ...e.newData };
            const { newModData, newWhoByWhoData } = processWhoEquals(newData);
            setStates(prev => ({ ...prev, quienConQuien: newWhoByWhoData }));
            setModData(newModData);
        }
    };


    const submit = async () => {
        // console.log('Submitting changes:', states.quienConQuien);
        try {
            const response = await fetch(route('changesswho'), {
                method: "POST",
                body: JSON.stringify({ quienconquien: states.quienConQuien }),
                headers: { "Content-Type": "application/json" }
            });

            if (response.ok) {
                setStates({ ...states, open: false });
                getWho();
                // showNotification('Actualización exitosa', 'success', 'metroui', 'bottomRight', 5000);
            } else {
                const errorData = await response.json();
                const message = errorData?.message || 'Error al actualizar';
                showNotification(message, 'error', 'metroui', 'bottomRight', 7000);
            }
        } catch (error) {
            showNotification('Error inesperado: ' + error.message, 'error', 'metroui', 'bottomRight', 7000);
        }
    };

    useEffect(() => {
        getWho();
    }, []);

    return (
        <div className="relative h-[98%] pb-4 px-3 overflow-auto blue-scroll">
            {states.loading &&
                <div className='flex items-center justify-center h-[100%] w-full'> <LoadingDiv /> </div>

            }
            {!states.loading &&
                <div className="flex flex-col h-full">

                    <div className="flex justify-between items-center p-3 border-b mb-4">
                        <h2 className="text-3xl font-bold text-gray-800">Quien con quien </h2>
                        <button
                            onClick={submit}
                            className="flex items-center px-4 py-2 text-base font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 transition duration-150 ease-in-out"
                        >
                           Guardar quien con quien
                        </button>
                    </div>


                    <div className="quienConQuienTablaTotal">
                        <Datatable
                            data={states.quienConQuien}
                            virtual={true}
                            tableId={'CUA_unidadID'}
                            handleRowUpdating={updateWhoRow}
                            editingMode={{ mode: "cell", allowUpdating: true }}
                            columns={[
                                {
                                    header: 'Unidad',
                                    accessor: 'Unidades_numeroEconomico',
                                    width: '20%',
                                    alignment: 'start',
                                    editable: false
                                },
                                {
                                    header: 'Choferes',
                                    accessor: 'CUA_choferID',
                                    lookup: {
                                        dataSource: states.choferes,
                                        displayExpr: "nombre_completo",
                                        valueExpr: "Personas_usuarioID",
                                    },
                                },

                                // {
                                //     header: 'Ayudantes',
                                //     accessor: 'CUA_ayudanteID',
                                //     lookup: {
                                //         dataSource: states.choferes,
                                //         displayExpr: "nombre_completo",
                                //         valueExpr: "Personas_usuarioID",
                                //     },
                                // },
                                {
                                    header: 'Motivos',
                                    accessor: 'CUA_motivoID',
                                    lookup: {
                                        dataSource: states.motivos,
                                        displayExpr: "Motivos_nombre",
                                        valueExpr: "Motivos_motivoID",
                                    },
                                },
                                {
                                    header: 'Destinos',
                                    accessor: 'CUA_destino',
                                    lookup: {
                                        dataSource: states.destinos,
                                        displayExpr: "Destinos_Nombre",
                                        valueExpr: "Destinos_Id",
                                    },
                                },
                            ]}
                        />
                    </div>
                </div>
            }
        </div>
    );
}
