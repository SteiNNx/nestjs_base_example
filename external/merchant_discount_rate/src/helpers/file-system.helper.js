const fs = require('fs');
const path = require('path');

/**
 * Función que analiza una línea de texto que representa un registro de tarifas MDR y
 * la convierte en un objeto con la estructura requerida por DynamoDB.
 *
 * La línea debe tener un formato de pares clave:valor separados por punto y coma (";").
 *
 * Ejemplo de línea:
 * "mcc:5411;dnps:1.70;dnpu:0.01;dnips:1.80;dnipu:0.02;dneo:1.90;dneou:0.03;..."
 *
 * @param {string} line - Línea de texto con los datos en formato clave:valor.
 * @returns {Object<string, { [propiedad: string]: { [tipo: string]: string } }>} Objeto con la estructura
 *          { atributoCompleto: { type: valor } } para su uso en DynamoDB.
 */
function parseTarifaLineToItem(line) {
  const item = {};

  // Separamos la línea por ";" y filtramos posibles entradas vacías.
  const pairs = line.split(';').filter(pair => pair.trim().length > 0);

  pairs.forEach(pair => {
    // Dividimos el par en clave y valor; si el formato no es correcto, lo omitimos.
    const parts = pair.split(':');
    if (parts.length !== 2) {
      console.warn(`Formato inválido en el par "${pair}" y se omitirá.`);
      return;
    }

    const [key, value] = parts;
    const trimmedKey = key.trim();
    const trimmedValue = value.trim();

    // Obtener la configuración del atributo desde el mapeo (definido externamente).
    const mapping = attributeMapping[trimmedKey];

    if (mapping) {
      // Si el atributo es de tipo numérico (N), definimos el valor en ese formato,
      // de lo contrario, se define como cadena (S).
      item[mapping.full] = mapping.type === 'N'
        ? { N: trimmedValue }
        : { S: trimmedValue };
    } else {
      console.warn(`La clave "${trimmedKey}" no tiene mapeo y se omitirá.`);
    }
  });

  return item;
}

/**
 * Función que carga dinámicamente el contenido de un archivo MDR a partir de su nombre.
 * Esta función puede utilizarse en un endpoint que reciba el nombre del archivo vía URL o parámetro.
 *
 * @param {string} fileName - Nombre del archivo a leer (ejemplo: "mdr_amex.data.txt").
 * @returns {string|null} El contenido del archivo en formato utf8 o null en caso de error.
 */
function readDynamicFile(fileName) {
  const filePath = path.join(__dirname, fileName);
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return fileContent;
  } catch (err) {
    console.error(`Error al leer el archivo "${fileName}":`, err);
    return null;
  }
}

/**
 * Exporta la función de parseo de líneas de tarifas MDR y la función de carga dinámica de archivos.
 *
 * @typedef {Object} ModuleExports
 * @property {Function} parseTarifaLineToItem - Función que transforma una línea de texto en
 *          un objeto con la estructura requerida por DynamoDB.
 * @property {Function} readDynamicFile - Función que lee el contenido de un archivo dinámicamente.
 *
 * @type {ModuleExports}
 */
module.exports = {
  parseTarifaLineToItem,
  readDynamicFile,
};
