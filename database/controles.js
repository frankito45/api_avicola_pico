import { GetDatos, GetDatosById, GetDatosGrup } from "../database/registroRepositori.js";
import { CrearRegistro } from "../servise/registroServise.js";

// POST /registro
export async function crearRegistro(req, res) {
  const data = req.body;

  console.log("DATA:", JSON.stringify(data, null, 2));

  const { local, fecha, item, estado, grupo, destino } = data;

  // 🔹 Validación básica
  if (!local || !fecha || !item || !estado || !grupo) {
    return res.status(400).json({
      ok: false,
      message: "La estructura recibida no coincide con la esperada",
      recibidos: data
    });
  }

  // 🔹 Validación específica de envío
  if (estado === "envio" && !destino) {
    return res.status(400).json({
      ok: false,
      message: "Falta destino para el envío"
    });
  }

  try {
    const resultado = await CrearRegistro(data);

    return res.status(201).json({
      ok: true,
      resultado
    });

  } catch (error) {
    console.error("ERROR REAL:", error);

    return res.status(500).json({
      ok: false,
      error: error.message
    });
  }
}


// GET /registro
export async function obtenerRegistro(req, res) {
  console.log("Entrando a GET /registro");

  try {
    const rows = await GetDatos();
    return res.status(200).json(rows);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al obtener registros" });
  }
}


// GET /registro/:id
export async function obtenerRegistroById(req, res) {
  const { id } = req.params;

  console.log("ID recibido:", id);

  try {
    const rows = await GetDatosById(id);
    return res.status(200).json(rows);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al obtener el registro" });
  }
}


// GET /registro/grupo/:grupo
export async function obtenerRegistroBygrupo(req, res) {
  const { grupo } = req.params;

  console.log("Grupo recibido:", grupo);

  try {
    const rows = await GetDatosGrup(grupo);
    return res.status(200).json(rows);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al obtener registros por grupo" });
  }
}