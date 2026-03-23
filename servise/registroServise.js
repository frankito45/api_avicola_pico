import db from "../database/bd.js";

export async function CrearRegistro(data) {
  const { fecha, item, estado, local, grupo, destino } = data;

  if (!item || !Array.isArray(item)) {
    throw new Error("Items inválidos");
  }

  const resultado = [];
  const esEnvio = estado === "envio";

  try {
    // 🔐 TRANSACTION (compatible)
    await db.query("START TRANSACTION");

    // 🔹 LOCAL
    const localQuery = await db.query(
      "SELECT id FROM local WHERE name = ?",
      [local]
    );
    const localRows = localQuery[0] || localQuery;
    if (!localRows.length) throw new Error(`Local '${local}' no existe`);
    const localId = localRows[0].id;

    // 🔹 ESTADO
    const estadoQuery = await db.query(
      "SELECT id FROM estado WHERE name = ?",
      [estado]
    );
    const estadoRows = estadoQuery[0] || estadoQuery;
    if (!estadoRows.length) throw new Error(`Estado '${estado}' no existe`);
    const estadoId = estadoRows[0].id;

    // 🔹 GRUPO
    const grupoQuery = await db.query(
      "SELECT id FROM grupo WHERE name = ?",
      [grupo]
    );
    const grupoRows = grupoQuery[0] || grupoQuery;
    if (!grupoRows.length) throw new Error(`Grupo '${grupo}' no existe`);
    const grupoId = grupoRows[0].id;

    // 🔹 DESTINO
    let destinoId = null;

    if (esEnvio) {
      if (!destino) throw new Error("Falta destino para el envío");

      const destinoQuery = await db.query(
        "SELECT id FROM local WHERE name = ?",
        [destino]
      );
      const destinoRows = destinoQuery[0] || destinoQuery;

      if (!destinoRows.length) {
        throw new Error(`Destino '${destino}' no existe`);
      }

      destinoId = destinoRows[0].id;

      if (destinoId === localId) {
        throw new Error("El destino no puede ser igual al local");
      }
    }

    // 🔹 ITEMS CACHE (evita múltiples queries)
    const itemsQuery = await db.query("SELECT id, name FROM item");
    const itemsDB = itemsQuery[0] || itemsQuery;

    const itemMap = new Map();
    itemsDB.forEach(i =>
      itemMap.set(i.name.trim().toLowerCase(), i.id)
    );

    // 🔹 INSERT
    for (const it of item) {
      const name = it.name?.trim().toLowerCase();
      const peso = it.peso;

      if (!name) throw new Error(`Item sin nombre`);
      if (peso == null) throw new Error(`Peso faltante en '${name}'`);
      if (peso <= 0) continue;

      const itemId = itemMap.get(name);
      if (!itemId) throw new Error(`Item '${name}' no existe`);

      const insertQuery = await db.query(
        `
        INSERT INTO registro 
        (fecha, item_id, peso, estado_id, local_id, grupo_id, destino_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [fecha, itemId, peso, estadoId, localId, grupoId, destinoId]
      );

      const insertResult = insertQuery[0] || insertQuery;

      resultado.push(insertResult.insertId);
    }

    // 🚫 Evitar commit vacío
    if (resultado.length === 0) {
      throw new Error("No hay items válidos para guardar");
    }

    await db.query("COMMIT");

    return resultado;

  } catch (error) {
    await db.query("ROLLBACK");

    console.error("Error en CrearRegistro:", error);

    throw error;
  }
}