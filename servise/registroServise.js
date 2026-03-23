import db from "../database/bd.js";

export async function CrearRegistro(data) {
  const { fecha, item, estado, local, grupo } = data;

  if (!item || !Array.isArray(item)) {
    throw new Error("Items inválidos");
  }

  const resultado = [];
  const esEnvio = estado === "envio";

  // 🔹 LOCAL (en envío esto ya es destino)
  const [localRows] = await db.query(
    "SELECT id FROM local WHERE name = ?",
    [local]
  );
  if (!localRows.length) throw new Error(`Local '${local}' no existe`);
  const localId = localRows[0].id;

  // 🔹 ESTADO
  const [estadoRows] = await db.query(
    "SELECT id FROM estado WHERE name = ?",
    [estado]
  );
  if (!estadoRows.length) throw new Error(`Estado '${estado}' no existe`);
  const estadoId = estadoRows[0].id;

  // 🔹 GRUPO
  const [grupoRows] = await db.query(
    "SELECT id FROM grupo WHERE name = ?",
    [grupo]
  );
  if (!grupoRows.length) throw new Error(`Grupo '${grupo}' no existe`);
  const grupoId = grupoRows[0].id;

  // 🔹 ITEMS
  for (const it of item) {
    const { name, peso } = it;

    if (!name) throw new Error(`Item sin nombre`);
    if (peso == null) throw new Error(`Peso faltante en item '${name}'`);
    if (peso <= 0) continue;

    const [itemRows] = await db.query(
      "SELECT id FROM item WHERE name = ?",
      [name]
    );

    if (!itemRows.length) throw new Error(`Item '${name}' no existe`);

    const itemId = itemRows[0].id;

    const [insertResult] = await db.query(
      `
      INSERT INTO registro 
      (fecha, item_id, peso, estado_id, local_id, grupo_id)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [fecha, itemId, peso, estadoId, localId, grupoId]
    );

    resultado.push(insertResult.insertId);
  }

  return resultado;
}