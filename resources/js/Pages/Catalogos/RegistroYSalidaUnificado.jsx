import React, { useState } from 'react';

// --- Componente Único: RegistroYSalidaUnificado ---

const RegistroYSalidaUnificado = () => {
    
    // --- LÓGICA DE ESTADO (Manejada internamente) ---
    
    const initialFormState = {
        movementType: 'ENTRADA',
        unit: '',
        driver: '',
        destination: '',
        kilometers: 0,
        motive: '',
        observations: '',
        checklist: {
            tires: null, 
            lights: null,
            brakes: null, // Crítico
            mirrors: null,
        },
        authorizationCode: '',
    };
    
    const [form, setForm] = useState(initialFormState);
    const [isCriticalAlertActive, setIsCriticalAlertActive] = useState(false);

    // Función para manejar cualquier cambio en el input (texto/número)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Función para manejar los toggles de Si/No (Checklist)
    const handleChecklistToggle = (name, value) => {
        setForm(prev => {
            const newChecklist = {
                ...prev.checklist,
                [name]: value
            };

            // Lógica de alerta crítica: si los frenos están en 'No'
            if (name === 'brakes') {
                setIsCriticalAlertActive(value === 'No');
            }
            
            return {
                ...prev,
                checklist: newChecklist
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
    
    // Función de registro (simulada)
    const registerMovement = () => {
        if (!form.destination) {
            alert('🚨 El Destino es un campo requerido.');
            return;
        }
        if (isCriticalAlertActive && !form.authorizationCode) {
            alert('🛑 Se requiere un código de autorización debido a la alerta crítica.');
            return;
        }
        
        console.log("Movimiento a registrar:", form);
        alert("Movimiento registrado (simulado).");
        // Aquí iría la llamada a la API
        // setForm(initialFormState); // Descomentar para resetear
    };
    
    // Función de solicitud de autorización (simulada)
    const solicitAuthorization = () => {
        alert('Enviando solicitud de código al supervisor...');
    };

    // Datos simulados para la tabla de Últimos movimientos (READ ONLY)
    const latestMovements = [
        { date: '02/10/2025', time: '10:02', unit: 'ECO-310', driver: 'Carlos Díaz', type: 'Salida' },
        { date: '02/10/2025', time: '09:10', unit: 'ECO-245', driver: 'María López', type: 'Entrada' },
        { date: '02/10/2025', time: '08:21', unit: 'ECO-102', driver: 'Juan Pérez', type: 'Salida' },
    ];

    // --- SUB-COMPONENTES DE PRESENTACIÓN (Definidos aquí para estar en el mismo archivo) ---
    
    const ToggleButton = ({ label, isActive, onClick }) => (
        <button
            onClick={onClick}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                isActive
                    ? 'bg-[#3b82f6] text-white shadow-lg' // bg-blue-500
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
            {label}
        </button>
    );

    const FormInput = ({ label, name, value, onChange, placeholder, isRequired = false, type = 'text', rows = 1 }) => (
        <div className={`flex flex-col gap-1 ${name === 'authorizationCode' ? '' : 'h-full'}`}>
            <label className="text-sm font-medium text-gray-600">
                {label} {isRequired && <span className="text-red-500">*</span>}
            </label>
            {rows > 1 ? (
                <textarea
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    rows={rows}
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 flex-grow"
                ></textarea>
            ) : (
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            )}
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
                    className={`px-4 py-1 text-sm font-semibold rounded-lg transition-colors duration-200 ${
                        currentValue === 'No'
                            ? 'bg-red-500 text-white shadow-md'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    No
                </button>
                <button
                    onClick={() => onToggle(name, 'Si')}
                    className={`px-4 py-1 text-sm font-semibold rounded-lg transition-colors duration-200 ${
                        currentValue === 'Si'
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
    
    const VideoUploadBox = ({ label }) => (
        <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50 cursor-pointer hover:bg-blue-100 transition-colors h-24">
            {/* Aquí iría un ícono de video (simulado con un span) */}
            <span className="text-xl text-blue-500">🎬</span> 
            <span className="text-xs font-medium text-blue-600">{label}</span>
            <span className="text-xs text-blue-500">Adjuntar o referenciar video...</span>
        </div>
    );
    
    const LatestMovementsTable = ({ movements }) => (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {['Fecha', 'Unidad', 'Chofer', 'Tipo'].map((header) => (
                            <th key={header} className="px-3 py-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {movements.map((mov, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800">
                                <span className="block font-medium">{mov.date}</span>
                                <span className="block text-xs text-gray-500">{mov.time}</span>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-800">{mov.unit}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800">{mov.driver}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    mov.type === 'Entrada' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                    {mov.type}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );


    // --- RENDERIZADO PRINCIPAL ---

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            
            {/* Encabezado General */}
            <div className="flex justify-between mb-8 border-b pb-4">
                <div className="text-xl font-bold text-gray-800">Unidad Seleccionada: <span className="text-blue-600">ECO—</span></div>
                <div className="text-xl font-bold text-gray-800">Chofer: <span className="text-blue-600">—</span></div>
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
                        <div className="flex gap-2 col-span-1">
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

                        {/* Motivo (Dropdown Placeholder) */}
                        <FormInput label="Motivo" name="motive" value={form.motive} onChange={handleChange} placeholder="Seleccionar motivo" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <FormInput label="Unidad (Número Económico)" name="unit" value={form.unit} onChange={handleChange} placeholder="Buscar unidad..." />
                        <FormInput label="Chofer / Ayudante" name="driver" value={form.driver} onChange={handleChange} placeholder="Buscar chofer..." />
                        <FormInput label="Destino (requerido)" name="destination" value={form.destination} onChange={handleChange} placeholder="Ej. Planta Norte / Cliente X" isRequired />
                        <FormInput label="Kilometraje (KM)" name="kilometers" value={form.kilometers} onChange={handleChange} placeholder="0" type="number" />
                        <FormInput label="Combustible" placeholder="" />
                        
                        {/* Observaciones (Textarea) */}
                        <FormInput label="Observaciones" name="observations" value={form.observations} onChange={handleChange} placeholder="Agregar nota opcional..." rows={3} />
                    </div>

                    {/* Checklist y Condiciones */}
                    <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Checklist y Condiciones</h2>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-6 p-3 border border-gray-200 rounded-lg">
                        <ConditionToggle label="Llantas en buen estado" name="tires" currentValue={form.checklist.tires} onToggle={handleChecklistToggle} isCritical />
                        <ConditionToggle label="Luces funcionando" name="lights" currentValue={form.checklist.lights} onToggle={handleChecklistToggle} />
                        <ConditionToggle label="Frenos operativos" name="brakes" currentValue={form.checklist.brakes} onToggle={handleChecklistToggle} isCritical />
                        <ConditionToggle label="Espejos intactos" name="mirrors" currentValue={form.checklist.mirrors} onToggle={handleChecklistToggle} />
                    </div>

                    {/* Alerta Crítica y Autorización (Visible si isCriticalAlertActive es true) */}
                    {isCriticalAlertActive && (
                        <div className="flex items-center justify-between gap-4 p-4 mb-6 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
                            <p className="text-sm font-semibold text-yellow-800">
                                Alerta Crítica: Requiere autorización del Supervisor.
                            </p>
                            <div className="flex flex-col gap-2">
                                <FormInput 
                                    label="" 
                                    name="authorizationCode" 
                                    value={form.authorizationCode} 
                                    onChange={handleChange} 
                                    placeholder="Ingresar Código"
                                />
                                <button 
                                    onClick={solicitAuthorization}
                                    className="px-4 py-2 bg-blue-100 text-blue-700 font-semibold rounded-lg hover:bg-blue-200 transition-colors"
                                >
                                    Solicitar Autorización
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Botón Final */}
                    <button 
                        onClick={registerMovement}
                        className="w-full py-3 bg-blue-600 text-white text-lg font-bold rounded-lg shadow-xl hover:bg-blue-700 transition-colors"
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

                    {/* Evidencia de Video */}
                    <h3 className="text-md font-bold text-gray-700 mb-3">Evidencia de Video</h3>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <VideoUploadBox label="Video de Entrada" />
                        <VideoUploadBox label="Video de Salida" />
                    </div>

                    {/* Últimos Movimientos */}
                    <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Últimos movimientos</h2>
                    <LatestMovementsTable movements={latestMovements} />

                </div>
            </div>
        </div>
    );
};

export default RegistroYSalidaUnificado;