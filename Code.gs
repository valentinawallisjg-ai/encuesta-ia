/**
 * Recibe las respuestas del formulario web y las guarda en Google Sheets.
 * - "encuesta" y "filtro" van a la planilla de respuestas (sin datos personales).
 * - "entrevista" y "resumen" (nombre, correo, teléfono) van a una planilla distinta si se indica CONTACT_SHEET_ID;
 *   si queda vacío, van a pestañas separadas de la misma planilla.
 *
 * Planilla de respuestas, en este orden:
 *   1. La de SHEET_ID, si se indica.
 *   2. La planilla desde la que se abrió este script (Extensiones > Apps Script).
 *   3. Si no hay ninguna, el script crea una llamada "Respuestas encuesta IA" en tu Drive y la sigue usando.
 */
const SHEET_ID = "";           // opcional: ID de la planilla de respuestas (lo que va entre /d/ y /edit en su URL)
const CONTACT_SHEET_ID = "";   // opcional: ID de otra planilla para los datos de contacto
const TABS = { encuesta: "Encuesta", filtro: "Filtro", entrevista: "Entrevista", resumen: "Resumen" };

function planilla_() {
  if (SHEET_ID) return SpreadsheetApp.openById(SHEET_ID);
  const activa = SpreadsheetApp.getActiveSpreadsheet();
  if (activa) return activa;
  const props = PropertiesService.getScriptProperties();
  const guardada = props.getProperty("SHEET_ID");
  if (guardada) {
    try { return SpreadsheetApp.openById(guardada); } catch (err) { /* fue borrada: se crea otra */ }
  }
  const nueva = SpreadsheetApp.create("Respuestas encuesta IA");
  props.setProperty("SHEET_ID", nueva.getId());
  return nueva;
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const data = JSON.parse(e.postData.contents);
    const tab = TABS[data.tipo];
    if (!tab) return out_("tipo desconocido");
    const personal = data.tipo === "entrevista" || data.tipo === "resumen";
    const ss = personal && CONTACT_SHEET_ID ? SpreadsheetApp.openById(CONTACT_SHEET_ID) : planilla_();
    let sh = ss.getSheetByName(tab) || ss.insertSheet(tab);
    const keys = Object.keys(data);
    let header = sh.getLastRow() ? sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0] : [];
    keys.forEach(k => { if (header.indexOf(k) < 0) header.push(k); });
    sh.getRange(1, 1, 1, header.length).setValues([header]).setFontWeight("bold");
    sh.appendRow(header.map(k => (data[k] === undefined ? "" : data[k])));
    return out_("ok");
  } catch (err) {
    return out_("error: " + err);
  } finally {
    lock.releaseLock();
  }
}

/** Abrir la URL /exec en el navegador muestra a qué planilla está escribiendo el script. */
function doGet() {
  try {
    return out_("Script activo. Planilla de respuestas: " + planilla_().getUrl());
  } catch (err) {
    return out_("error: " + err);
  }
}

/** Ejecutar una vez desde el editor (botón Ejecutar) para autorizar permisos y ver la URL de la planilla en el registro. */
function probar() {
  Logger.log(planilla_().getUrl());
}

function out_(t) { return ContentService.createTextOutput(t); }
