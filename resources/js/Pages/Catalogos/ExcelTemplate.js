// import { getEnterpriseData } from '@/utils';
import { Workbook, FormulaType } from 'exceljs';
import moment from 'moment';
import logo from '../../../../public/img/logo.png' // Asumimos que esta importación resuelve a la URL pública de la imagen

// 💡 FUNCIÓN DE UTILIDAD: Convierte URL de imagen a Base64 pura
/**
 * Convierte una URL (o Blob) de imagen a una cadena Base64 limpia.
 * @param {string} url - La URL del recurso (que es el valor de 'logo' después de la importación).
 * @returns {Promise<string>} - La cadena Base64 limpia.
 */
function urlToBase64(url) {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error al cargar la imagen: ${response.statusText}`);
                }
                return response.blob();
            })
            .then(blob => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    // Limpia el prefijo MIME (data:image/png;base64,)
                    const base64String = reader.result.split(',').pop(); 
                    resolve(base64String);
                };
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            })
            .catch(reject);
    });
}

export async function excelTemplate(excelData, excelColumns, estado, name) {
    const fch = moment().format('DD/MM/YYYY hh:mm a')

    const data = excelData.map((item, index) => {
        const convertedItem = {};
        for (let i = 0; i < excelColumns.length; i++) {
            const prop = excelColumns[i].accessor;
            if (item[prop]) {
                if (excelColumns[i].type === "number" || excelColumns[i].type === "money") {
                    convertedItem[prop] = !isNaN(item[prop]) ? parseFloat(item[prop]) : '';
                } else if (excelColumns[i].type === 'date') {
                    const fecha = item[prop].split(' ')
                    const [year, month, day] = fecha[0].split('-');
                    const date = new Date(`${year}-${month}-${day}`);
                    convertedItem[prop] = !isNaN(date.getTime()) ? date : '';
                } else {
                    convertedItem[prop] = item[prop] ?? '';
                }
            } else {
                convertedItem[prop] = '';
            }
        }
        return convertedItem;
    });

    const headers = excelColumns.map((column) => {
        return column.header;
    });

    const workbook = new Workbook();
    
    // 🚀 NUEVO PASO: Convertir la URL de la imagen a Base64 limpia para exceljs
    let cleanBase64;
    try {
        cleanBase64 = await urlToBase64(logo);
    } catch (error) {
        console.error("Error al obtener la imagen del logo:", error);
        // Puedes optar por continuar sin logo o lanzar un error. Aquí continuamos.
        cleanBase64 = ''; 
    }
    
    let imageId;
    if (cleanBase64) {
        imageId = workbook.addImage({
            base64: cleanBase64, 
            extension: 'png', // Asegúrate de que la extensión sea correcta
        });
    }

    let worksheet = workbook.addWorksheet('Hoja1');
    
    // Pasar imageId, solo se agregará si existe
    worksheet = await generatTemplate(worksheet, workbook, ('Reportes ' + fch), 'H', estado, imageId)

    const headerStyle = {
        font: { bold: true, color: { argb: 'FFFFFFFF' } },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '1B2654' } },
    };

    const headersRow = worksheet.addRow(headers);
    headersRow.eachCell((cell) => {
        cell.font = headerStyle.font;
        cell.fill = headerStyle.fill;
    });

    data.forEach((reg) => {
        const row = excelColumns.map((col) => {
            let value = reg[col.accessor];
            return value;
        });
        worksheet.addRow(row);
    });

    excelColumns.forEach((col, index) => {
        worksheet.getColumn(index + 1).width = 25;
    });

    worksheet.autoFilter = {
        from: {
            row: headersRow.number,
            column: 1,
        },
        to: {
            row: headersRow.number,
            column: worksheet.columnCount,
        },
    };

    // Agregar una fila vacía
    worksheet.addRow({});

    // Configurar fórmulas de suma para las columnas "I" a "J"
    const columnsToSum = ['I', 'J'];
    columnsToSum.forEach((col) => {
        const totalCell = worksheet.getCell(`${col}${worksheet.lastRow.number}`);
        totalCell.value = {
            formula: `SUM(${col}7:${col}${worksheet.lastRow.number - 1})`, 
            formulaType: FormulaType.Shared, 
        };
    });

    workbook.xlsx.writeBuffer().then((data) => {
        const blob = new Blob([data], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${name}.xlsx`;
        a.click();

        window.URL.revokeObjectURL(url);
    });
}

export async function generatTemplate(worksheet, workbook, title = '', finalLogo = 'Z', data, imageId) {
    // Solo agrega la imagen si imageId es válido
    if (imageId) {
        worksheet.addImage(imageId, 
            {
                tl: { col: 0, row: 0.3 }, 
                ext: { height: 75, width: 350 },
                editAs: 'absolute',
            }
        );
    }
    
    worksheet.addRows([{}, {}, {}, {}]);
    worksheet.getCell('C1').value = `DELFIN TECNOLOGY, S.A. DE C.V`;
    worksheet.getCell('C1').style = { font: { bold: true, size: 20 } };
    worksheet.mergeCells('A1:B3');
    worksheet.mergeCells(`C1:${finalLogo}1`);
    worksheet.getCell('C2').value = title;
    worksheet.getCell('C2').style = { font: { bold: true, size: 15 } };
    worksheet.mergeCells(`C2:${finalLogo}2`);
    worksheet.mergeCells(`C3:${finalLogo}3`);
    // worksheet.getCell('C3').value = 'REPORTE DEL ' + moment(data.fechainicio).format('DD/MM/YYYY') + ' AL ' + moment(data.fechafin).format('DD/MM/YYYY');
    return worksheet;
}