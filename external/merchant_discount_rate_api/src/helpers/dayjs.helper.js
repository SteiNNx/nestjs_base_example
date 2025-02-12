/**
 * @file dayjs.utils.js
 * @description Módulo que provee utilidades de formateo y obtención de fechas/horas mediante Day.js.
 *              Incluye patrones de formato (DATE_TIME_FORMATS) y funciones para obtener la fecha/hora
 *              actual o para formatear una fecha concreta en distintos patrones. Ahora con la opción
 *              de usar UTC o la hora local.
 */

const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');

dayjs.extend(utc);

/**
 * Conjunto de patrones de formato para fechas/horas.
 * Puedes extenderlo según tus necesidades.
 *
 * @constant {Object}
 * @property {string} ISO_DATE - Formato "YYYY-MM-DD" (ej. 2025-02-11).
 * @property {string} HHMMSS - Formato "HH:mm:ss" (ej. 14:35:10).
 * @property {string} SLASH_DDMMYYYY - Formato "DD/MM/YYYY" (ej. 11/02/2025).
 * @property {string} SLASH_DDMMYYYY_HHMM - Formato "DD/MM/YYYY HH:mm" (ej. 11/02/2025 14:35).
 * @property {string} SLASH_DDMMYYYY_HHMMSS - Formato "DD/MM/YYYY HH:mm:ss" (ej. 11/02/2025 14:35:10).
 */
const DATE_TIME_FORMATS = {
    ISO_DATE: 'YYYY-MM-DD',
    HHMMSS: 'HH:mm:ss',
    SLASH_DDMMYYYY: 'DD/MM/YYYY',
    SLASH_DDMMYYYY_HHMM: 'DD/MM/YYYY HH:mm',
    SLASH_DDMMYYYY_HHMMSS: 'DD/MM/YYYY HH:mm:ss',
};

/* --------------------------------------------------------------------------------------
 *                                UTILERÍA INTERNA
 * -------------------------------------------------------------------------------------- */

/**
 * Obtiene una instancia de dayjs en local o en UTC, dependiendo de `useUTC`.
 * @param {Date|string|number|undefined} date - La fecha base. Si no se provee, se usa la fecha/hora actual.
 * @param {boolean} useUTC - Define si se debe usar UTC (true) o local (false).
 * @returns {dayjs.Dayjs} Instancia de dayjs (UTC si useUTC=true, o local en caso contrario).
 */
function getDayjsInstance(date, useUTC) {
    if (useUTC) {
        // Si no se pasa fecha, dayjs() agarra la actual y luego .utc() la convierte a UTC
        return dayjs(date).utc();
    }
    return dayjs(date);
}

/* --------------------------------------------------------------------------------------
 *                                OBTENER FECHA/HORA ACTUAL
 * -------------------------------------------------------------------------------------- */

/**
 * Obtiene la fecha actual en formato ISO (YYYY-MM-DD).
 *
 * @function getCurrentIsoDate
 * @param {boolean} [useUTC=false] - Si es true, retorna la fecha en UTC; de lo contrario, local.
 * @returns {string} La fecha actual en formato "YYYY-MM-DD".
 * @example
 * // Supongamos que hoy es 11 de febrero de 2025
 * getCurrentIsoDate();         // "2025-02-11" (local)
 * getCurrentIsoDate(true);     // "2025-02-11" (UTC)
 */
function getCurrentIsoDate(useUTC = false) {
    return getDayjsInstance(undefined, useUTC).format(DATE_TIME_FORMATS.ISO_DATE);
}

/**
 * Obtiene la hora actual en formato HH:mm:ss.
 *
 * @function getCurrentHHMMSS
 * @param {boolean} [useUTC=false] - Si es true, retorna la hora en UTC; de lo contrario, local.
 * @returns {string} La hora actual en formato "HH:mm:ss".
 * @example
 * // Si la hora local es 14:35:10
 * getCurrentHHMMSS();        // "14:35:10" (local)
 * getCurrentHHMMSS(true);    // "17:35:10" (UTC, ejemplo)
 */
function getCurrentHHMMSS(useUTC = false) {
    return getDayjsInstance(undefined, useUTC).format(DATE_TIME_FORMATS.HHMMSS);
}

/**
 * Obtiene la fecha/hora actual en formato "DD/MM/YYYY".
 *
 * @function getCurrentSlashDdMmYyyy
 * @param {boolean} [useUTC=false] - Si es true, retorna la fecha en UTC; de lo contrario, local.
 * @returns {string} La fecha actual en formato "DD/MM/YYYY".
 * @example
 * getCurrentSlashDdMmYyyy();        // "11/02/2025" (local)
 * getCurrentSlashDdMmYyyy(true);    // "11/02/2025" (UTC)
 */
function getCurrentSlashDdMmYyyy(useUTC = false) {
    return getDayjsInstance(undefined, useUTC).format(DATE_TIME_FORMATS.SLASH_DDMMYYYY);
}

/**
 * Obtiene la fecha/hora actual en formato "DD/MM/YYYY HH:mm".
 *
 * @function getCurrentSlashDdMmYyyyHhMm
 * @param {boolean} [useUTC=false] - Si es true, retorna la fecha en UTC; de lo contrario, local.
 * @returns {string} La fecha/hora actual en formato "DD/MM/YYYY HH:mm".
 * @example
 * getCurrentSlashDdMmYyyyHhMm();      // "11/02/2025 14:35" (local)
 * getCurrentSlashDdMmYyyyHhMm(true);  // "11/02/2025 17:35" (UTC, ejemplo)
 */
function getCurrentSlashDdMmYyyyHhMm(useUTC = false) {
    return getDayjsInstance(undefined, useUTC).format(DATE_TIME_FORMATS.SLASH_DDMMYYYY_HHMM);
}

/**
 * Obtiene la fecha/hora actual en formato "DD/MM/YYYY HH:mm:ss".
 *
 * @function getCurrentSlashDdMmYyyyHhMmSs
 * @param {boolean} [useUTC=false] - Si es true, retorna la fecha/hora en UTC; de lo contrario, local.
 * @returns {string} La fecha/hora actual en formato "DD/MM/YYYY HH:mm:ss".
 * @example
 * getCurrentSlashDdMmYyyyHhMmSs();       // "11/02/2025 14:35:10" (local)
 * getCurrentSlashDdMmYyyyHhMmSs(true);   // "11/02/2025 17:35:10" (UTC, ejemplo)
 */
function getCurrentSlashDdMmYyyyHhMmSs(useUTC = false) {
    return getDayjsInstance(undefined, useUTC).format(DATE_TIME_FORMATS.SLASH_DDMMYYYY_HHMMSS);
}

/* --------------------------------------------------------------------------------------
 *                                FORMATEAR FECHAS
 * -------------------------------------------------------------------------------------- */

/**
 * Formatea una fecha (date) al patrón "YYYY-MM-DD".
 *
 * @function formatDateIso
 * @param {Date|string|number} date - La fecha a formatear (objeto Date, cadena o timestamp).
 * @param {boolean} [useUTC=false] - Si es true, formatea la fecha en UTC; de lo contrario, local.
 * @returns {string} Una cadena en formato "YYYY-MM-DD". Retorna cadena vacía si `date` no es válido.
 * @example
 * formatDateIso('2025-02-11T14:35:00');      // "2025-02-11" (local)
 * formatDateIso('2025-02-11T14:35:00', true); // "2025-02-11" (UTC)
 */
function formatDateIso(date, useUTC = false) {
    if (!date) return '';
    return getDayjsInstance(date, useUTC).format(DATE_TIME_FORMATS.ISO_DATE);
}

/**
 * Formatea una fecha (date) en el patrón "HH:mm:ss".
 *
 * @function formatTimeHHMMSS
 * @param {Date|string|number} date - La fecha/hora a formatear.
 * @param {boolean} [useUTC=false] - Si es true, formatea en UTC; de lo contrario, local.
 * @returns {string} Una cadena en formato "HH:mm:ss". Retorna cadena vacía si `date` no es válido.
 * @example
 * formatTimeHHMMSS('2025-02-11T14:35:10');       // "14:35:10" (local)
 * formatTimeHHMMSS('2025-02-11T14:35:10', true); // "17:35:10" (UTC)
 */
function formatTimeHHMMSS(date, useUTC = false) {
    if (!date) return '';
    return getDayjsInstance(date, useUTC).format(DATE_TIME_FORMATS.HHMMSS);
}

/**
 * Formatea una fecha (date) en el patrón "DD/MM/YYYY".
 *
 * @function formatDateSlashDdMmYyyy
 * @param {Date|string|number} date - La fecha a formatear.
 * @param {boolean} [useUTC=false] - Si es true, formatea en UTC; de lo contrario, local.
 * @returns {string} Una cadena en formato "DD/MM/YYYY". Retorna cadena vacía si `date` no es válido.
 * @example
 * formatDateSlashDdMmYyyy('2025-02-11');        // "11/02/2025" (local)
 * formatDateSlashDdMmYyyy('2025-02-11', true);  // "11/02/2025" (UTC)
 */
function formatDateSlashDdMmYyyy(date, useUTC = false) {
    if (!date) return '';
    return getDayjsInstance(date, useUTC).format(DATE_TIME_FORMATS.SLASH_DDMMYYYY);
}

/**
 * Formatea una fecha (date) en el patrón "DD/MM/YYYY HH:mm".
 *
 * @function formatDateSlashDdMmYyyyHhMm
 * @param {Date|string|number} date - La fecha a formatear.
 * @param {boolean} [useUTC=false] - Si es true, formatea en UTC; de lo contrario, local.
 * @returns {string} Una cadena en formato "DD/MM/YYYY HH:mm". Retorna cadena vacía si `date` no es válido.
 * @example
 * formatDateSlashDdMmYyyyHhMm('2025-02-11T14:35');       // "11/02/2025 14:35" (local)
 * formatDateSlashDdMmYyyyHhMm('2025-02-11T14:35', true); // "11/02/2025 17:35" (UTC)
 */
function formatDateSlashDdMmYyyyHhMm(date, useUTC = false) {
    if (!date) return '';
    return getDayjsInstance(date, useUTC).format(DATE_TIME_FORMATS.SLASH_DDMMYYYY_HHMM);
}

/**
 * Formatea una fecha (date) en el patrón "DD/MM/YYYY HH:mm:ss".
 *
 * @function formatDateSlashDdMmYyyyHhMmSs
 * @param {Date|string|number} date - La fecha a formatear.
 * @param {boolean} [useUTC=false] - Si es true, formatea en UTC; de lo contrario, local.
 * @returns {string} Una cadena en formato "DD/MM/YYYY HH:mm:ss". Retorna cadena vacía si `date` no es válido.
 * @example
 * formatDateSlashDdMmYyyyHhMmSs('2025-02-11T14:35:10');       // "11/02/2025 14:35:10" (local)
 * formatDateSlashDdMmYyyyHhMmSs('2025-02-11T14:35:10', true); // "11/02/2025 17:35:10" (UTC)
 */
function formatDateSlashDdMmYyyyHhMmSs(date, useUTC = false) {
    if (!date) return '';
    return getDayjsInstance(date, useUTC).format(DATE_TIME_FORMATS.SLASH_DDMMYYYY_HHMMSS);
}

/* --------------------------------------------------------------------------------------
 *                                EXPORTACIÓN
 * -------------------------------------------------------------------------------------- */

module.exports = {
    // Patrones de formato
    DATE_TIME_FORMATS,

    // Fechas/Horas actuales (local/UTC opcional)
    getCurrentIsoDate,
    getCurrentHHMMSS,
    getCurrentSlashDdMmYyyy,
    getCurrentSlashDdMmYyyyHhMm,
    getCurrentSlashDdMmYyyyHhMmSs,

    // Funciones de formateo (local/UTC opcional)
    formatDateIso,
    formatTimeHHMMSS,
    formatDateSlashDdMmYyyy,
    formatDateSlashDdMmYyyyHhMm,
    formatDateSlashDdMmYyyyHhMmSs,
};
