import React, { useState, useEffect } from 'react';
import Datatable from "@/Components/Datatable";

const RegistroYSalidaUnificado = () => {

    const [requests, setRequests] = useState({
        Motivos: [],
        Unidades: [],
        Choferes: [],
        Ayudantes: [],
        Destinos: [],
        ListasVerificacion: [],
        UltimosMovimientos: [],
    });


    const [informacion, setInformacion] = useState({
        NombreUnidad: '',
        UltimoKilometraje: '',
        NombreAyudante: '',
        NombreOperador: '',
        Estado: '',

    });



    // Función auxiliar para obtener datos de una ruta
    const fetchData = async (routeName) => {
        const response = await fetch(route(routeName));
        if (!response.ok) {
            throw new Error(`Fallo al cargar ${routeName}: ${response.statusText}`);
        }
        return response.json();
    };

    const loadAllData = async () => {
        try {
            // 1. Ejecutar todas las llamadas API en paralelo con Promise.all
            const [
                MotivosData,
                UnidadesData,
                ChoferesData,
                AyudantesData,
                DestinosData,
                ListasData,
            ] = await Promise.all([
                fetchData("motivos.index"),
                fetchData("unidades.index"),
                fetchData("users.index"), // Rutas asumidas
                fetchData("users.index"), // Rutas asumidas
                fetchData("destinos.index"),
                fetchData("listaverificacion.index"),
            ]);

            // **2. Una única llamada a setRequests con todos los datos**
            setRequests(prevRequests => ({
                ...prevRequests,
                Motivos: MotivosData,
                Unidades: UnidadesData,
                Choferes: ChoferesData,
                Ayudantes: AyudantesData,
                Destinos: DestinosData,
                ListasVerificacion: ListasData,

            }));

        } catch (error) {
            console.error('Error al cargar datos:', error);
            // Opcional: toast.error('No se pudieron cargar algunos datos iniciales.');
        }
    }

    useEffect(() => {
        loadAllData();
    }, []);




    const initialFormState = {
        movementType: 'ENTRADA',
        unit: '',
        driver: '',
        destination: '',
        kilometers: 0,
        motive: '',
        observation: '',
        combustible: '',
        checklist: [],
        authorizationCode: '',
    };

    const [form, setForm] = useState(initialFormState);

    // const [isCriticalAlertActive, setIsCriticalAlertActive] = useState(false);


    useEffect(() => { if (form.unit) { fetchUltimosMovimientos(form.unit); } }, [form.unit]);





    const fetchUltimosMovimientos = async (e) => {
        try {
            const response = await fetch(route('ultimos-movimientos-unidad'), {
                method: 'POST',
                body: JSON.stringify({ unidadID: form.unit }),
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            setRequests(prevRequests => ({
                ...prevRequests,
                UltimosMovimientos: data,
            }));
        } catch (err) {
            console.error('Error al obtener movimientos:', err);
        }
    };


    const CrearAsignacion = async () => {
        try {
            const response = await fetch(route('asignaciones.store'), {
                method: 'POST',
                body: JSON.stringify(form),
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            fetchUltimosMovimientos();
            // }));
        } catch (err) {
            console.error('Error al obtener movimientos:', err);
        }
    };

    const handleChecklistToggle = (listId, statusValue) => {
        // listId: El ID de la lista (ej: '1', '2', etc., pasado por el 'name' del ConditionToggle)
        // statusValue: 'Si' o 'No'

        setForm(prevForm => {
            const currentChecklist = prevForm.checklist;

            // 1. Busca si el elemento ya existe en el array
            const existingIndex = currentChecklist.findIndex(item => item.id === listId);

            let newChecklist;

            if (existingIndex > -1) {
                // 2. Si existe, actualiza su propiedad 'observacion'
                newChecklist = currentChecklist.map((item, index) =>
                    index === existingIndex
                        ? { ...item, observacion: statusValue } // Actualiza inmutablemente
                        : item
                );
            } else {
                // 3. Si no existe, agrega el nuevo objeto al final
                const newItem = {
                    id: listId,
                    observacion: statusValue
                };
                newChecklist = [...currentChecklist, newItem];
            }

            return {
                ...prevForm,
                checklist: newChecklist,
            };
        });
    };
    // Función para cambiar el tipo de movimiento
    const setMovementType = (type) => {
        setForm(prev => ({
            ...prev,
            movementType: type
        }));
    };


    const ToggleButton = ({ label, isActive, onClick }) => (
        <button
            onClick={onClick}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-200 ${isActive
                ? 'bg-[#3b82f6] text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
        >
            {label}
        </button>
    );

    useEffect(() => {
        // You can uncomment this if you need to fetch data when the form changes
        // fetchUltimosMovimientos(form.unit);

        const Unidad = requests.Unidades.find(u => u.Unidades_unidadID === Number(form.unit));
        const Chofer = requests.Choferes.find(C => C.Personas_usuarioID === Number(form.driver));

        console.log('Unidad encontrada:', Unidad);
        console.log('Chofer encontrado:', Chofer);

        // Variables para almacenar la información, con valores predeterminados seguros
        let nombreUnidad = '';
        let nombreOperador = '';

        // 1. Verificar si la Unidad fue encontrada
        if (Unidad) {
            nombreUnidad = Unidad.Unidades_numeroEconomico;
        }

        // 2. Verificar si el Chofer fue encontrado
        if (Chofer) {
            // Usar la propiedad del objeto Chofer encontrado
            nombreOperador = Chofer.nombre_completo || '';
        }

        // 3. Establecer el estado con la información recopilada
        setInformacion({
            NombreUnidad: nombreUnidad,
            UltimoKilometraje: '', // Placeholder
            NombreAyudante: '',    // Placeholder
            NombreOperador: nombreOperador,
            Estado: '',            // Placeholder
        });

        // NOTE: The dependencies [form.driver, form.kilometers] are not currently
        // being used inside the effect. Consider removing them unless 
        // you plan to use them (e.g., in a fetch function).
    }, [form.unit, form.driver]);


    const SelectInput = ({
        label,
        name,
        value,
        onChange,
        options,
        isRequired = false,
        placeholder = "Seleccionar...",
        valueKey = "value", // Valor por defecto
        labelKey = "label"  // Valor por defecto
    }) => (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">
                {label} {isRequired && <span className="text-red-500">*</span>}
            </label>
            <select
                name={name}
                value={value}
                onChange={onChange}
                required={isRequired}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white appearance-none"
            >
                <option value="" disabled hidden>{placeholder}</option>

                {options.map((option, index) => (
                    <option key={option[valueKey] || index} value={option[valueKey]}>
                        {option[labelKey]}
                    </option>
                ))}
            </select>
        </div>
    );

    const ConditionToggle = ({ label, name, currentValue, onToggle, isCritical = false }) => (
        <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
            <span className="text-sm font-medium text-gray-700">
                {label}
                {isCritical && <span className="text-red-500 text-xs ml-1">(Crítico)</span>}
            </span>
            <div className="flex gap-2">
                <button
                    onClick={() => onToggle(name, 'No')}
                    className={`px-4 py-1 text-sm font-semibold rounded-lg transition-colors duration-200 ${currentValue === 'No'
                        ? 'bg-red-500 text-white shadow-md'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                >
                    No
                </button>
                <button
                    onClick={() => onToggle(name, 'Si')}
                    className={`px-4 py-1 text-sm font-semibold rounded-lg transition-colors duration-200 ${currentValue === 'Si'
                        ? 'bg-green-500 text-white shadow-md'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                >
                    Sí
                </button>
            </div>
        </div>
    );

    const ResumenItem = ({ label, value }) => (
        <div className="flex justify-between items-center py-1 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-600">{label}</span>
            <span className="text-sm font-semibold text-gray-800">{value}</span>
        </div>
    );


    return (
        <div className="p-6 bg-gray-50 min-h-screen">

            {/* Encabezado General */}
            <div className="flex justify-between mb-8 border-b pb-4">
                <div className="text-xl font-bold text-gray-800">Unidad Seleccionada: <span className="text-blue-600">
                    {informacion.NombreUnidad || '—'}
                </span></div>
                <div className="text-xl font-bold text-gray-800">Chofer: <span className="text-blue-600">{informacion.NombreOperador || '—'}</span></div>
                <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold">
                    Estado: <span className="font-bold">Pendiente</span>
                </div>
            </div>

            {/* Contenedor Principal de las 2 Columnas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* === COLUMNA IZQUIERDA: DATOS DEL MOVIMIENTO === */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Datos del Movimiento</h2>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        {/* Toggle ENTRADA/SALIDA */}
                        <div className="flex gap-2 col-span-1 ">
                            <ToggleButton
                                label="ENTRADA"
                                isActive={form.movementType === 'ENTRADA'}
                                onClick={() => setMovementType('ENTRADA')}
                            />
                            <ToggleButton
                                label="SALIDA"
                                isActive={form.movementType === 'SALIDA'}
                                onClick={() => setMovementType('SALIDA')}
                            />
                        </div>


                        <SelectInput
                            label="Motivo"
                            value={form.motive}
                            onChange={(event) => {
                                setForm({ ...form, motive: event.target.value });
                            }}
                            options={requests.Motivos}
                            placeholder="Seleccionar motivo..."
                            valueKey="Motivos_motivoID"
                            labelKey="Motivos_nombre"
                        />

                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">

                        <SelectInput
                            label="Unidad (Número Económico)"
                            value={form.unit}
                            onChange={(event) => {
                                setForm({ ...form, unit: event.target.value });
                            }}
                            options={requests.Unidades}
                            placeholder="Seleccionar unidad..."
                            valueKey="Unidades_unidadID"
                            labelKey="Unidades_numeroEconomico"
                        />

                        <SelectInput
                            label="Chofer / Ayudante"
                            value={form.driver}
                            onChange={(event) => { setForm({ ...form, driver: event.target.value }); }}
                            options={requests.Choferes}
                            placeholder="Seleccionar Chofer / ayudante"
                            valueKey="Personas_usuarioID"
                            labelKey="nombre_completo"
                        />

                        <SelectInput
                            label="Destino"
                            value={form.destination}
                            onChange={(event) => { setForm({ ...form, destination: event.target.value }); }}
                            options={requests.Destinos}
                            placeholder="Seleccionar destino..."
                            valueKey="Destinos_Id"
                            labelKey="Destinos_Nombre"
                        />


                        {/* <div className={`flex flex-col gap-1 h-full`}>
                            <label className="text-sm font-medium text-gray-600">
                                Combustible
                            </label>

                            <input
                                type="number"
                                value={form.combustible}
                                onChange={(e) => { // <-- Cambiado de (value) a (e) para recibir el objeto de evento
                                    setForm({ ...form, combustible: e.target.value }); // <-- Usando e.target.value para obtener el valor
                                }}
                                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div> */}

                        <SelectInput
                            label="Combustible"
                            value={form.combustible}
                            onChange={(event) => { setForm({ ...form, combustible: event.target.value }); }}
                            options={[
                                {
                                    nombre: '1/8',
                                    escala_valor: 1, // Se utiliza para el 'value' del select
                                    litros: 5
                                },
                                {
                                    nombre: '1/4',
                                    escala_valor: 2,
                                    litros: 10
                                },
                                {
                                    nombre: '3/8',
                                    escala_valor: 3,
                                    litros: 15
                                },
                                {
                                    nombre: '1/2',
                                    escala_valor: 4,
                                    litros: 20
                                },
                                {
                                    nombre: '5/8',
                                    escala_valor: 5,
                                    litros: 25
                                },
                                {
                                    nombre: '3/4',
                                    escala_valor: 6,
                                    litros: 30
                                },
                                {
                                    nombre: '7/8',
                                    escala_valor: 7,
                                    litros: 35
                                },
                                {
                                    nombre: 'Lleno',
                                    escala_valor: 8,
                                    litros: 40
                                }
                            ]}
                            placeholder="Seleccionar combustible"
                            valueKey="escala_valor"
                            labelKey="nombre"
                        />



                        <div className={`flex flex-col gap-1 h-full`}>
                            <label className="text-sm font-medium text-gray-600">
                                Kilometraje
                            </label>

                            <input
                                type="number"
                                name="Motivos_nombre"
                                value={form.kilometers}
                                onChange={(e) => { // <-- Cambiado de (value) a (e) para recibir el objeto de evento
                                    setForm({ ...form, kilometers: e.target.value }); // <-- Usando e.target.value para obtener el valor
                                }}
                                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>


                        <div className={`flex flex-col gap-1 h-full`}>
                            <label className="text-sm font-medium text-gray-600">
                                Observaciones
                            </label>

                            <input
                                type="text"
                                name="Motivos_nombre"
                                value={form.observation}
                                onChange={(e) => { // <-- Cambiado de (value) a (e) para recibir el objeto de evento
                                    setForm({ ...form, observation: e.target.value }); // <-- Usando e.target.value para obtener el valor
                                }}
                                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                    </div>

                    {/* Checklist y Condiciones */}
                    <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Checklist y Condiciones</h2>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-6 p-3 border border-gray-200 rounded-lg">

                        {requests.ListasVerificacion.map((item) => {
                            const listId = item.ListaVerificacion_listaID.toString();

                            // 🚨 CORRECCIÓN CLAVE: Asegurar que form.checklist sea un array antes de buscar.
                            const currentItem = Array.isArray(form.checklist)
                                ? form.checklist.find(i => i.id === listId)
                                : undefined;

                            // Esto evita el error si form.checklist es undefined, null, o un objeto {}

                            const currentValue = currentItem ? currentItem.observacion : undefined;

                            return (
                                <ConditionToggle
                                    key={listId}
                                    label={item.ListaVerificacion_nombre}
                                    name={listId}
                                    currentValue={currentValue}
                                    onToggle={handleChecklistToggle}
                                    isCritical={item.ListaVerificacion_tipo === "Obligatorio"}
                                />
                            );
                        })}
                    </div>


                    <button
                        onClick={CrearAsignacion}
                        disabled={form.unit === '' || form.driver === '' || form.destination === '' || form.motive === '' || form.kilometers === '' || form.combustible === ''}
                        className={`w-full py-3 text-white text-lg font-bold rounded-lg shadow-xl transition-colors 
        ${form.unit === '' || form.driver === '' || form.destination === '' || form.motive === '' || form.kilometers === '' || form.combustible === ''
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        REGISTRAR MOVIMIENTO
                    </button>
                </div>


                {/* === COLUMNA DERECHA: RESUMEN Y EVIDENCIAS === */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Resumen y Evidencias</h2>

                    {/* Resumen de Datos (enlazados al estado actual) */}
                    <div className="flex flex-col gap-4 mb-6">
                        <ResumenItem label="Unidad" value={form.unit || '—'} />
                        <ResumenItem label="Chofer / Ayudante" value={form.driver || '—'} />
                        <ResumenItem label="Motivo" value={form.motive || '—'} />
                        <ResumenItem label="Destino" value={form.destination || '—'} />
                        <ResumenItem label="KM / Combustible" value={`${form.kilometers} / 0`} />
                    </div>

                    <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Últimos movimientos</h2>

                    <Datatable
                        data={requests.UltimosMovimientos}
                        virtual={true}
                        searcher={false}

                        columns={[
                            { header: 'Fecha', accessor: 'Movimientos_fecha' },
                            { header: 'Kilometraje', accessor: 'Movimientos_kilometraje' },
                            { header: 'Chofer', accessor: 'Unidades_ano' },
                            { header: 'Tipo', accessor: 'Movimientos_tipoMovimiento' },
                        ]}
                    />


                </div>
            </div>
        </div>
    );
};

export default RegistroYSalidaUnificado;