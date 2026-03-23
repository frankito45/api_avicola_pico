import db from "../database/bd.js";

export async function CrearRegistro(data) {
  const { fecha, item, estado, local, grupo, destino } = data;

  const resultado = [];
  const esEnvio = estado === "envio";

  try {
    // 🔐 Iniciar transacción
    await db.query("START TRANSACTION");

    // 🔹 LOCAL
    const localRows = await db.query(
      "SELECT id FROM local WHERE name = ?",
      [local]
    );
    if (!localRows.length) throw new Error(`Local '${local}' no existe`);
    const localId = localRows[0].id;

    // 🔹 ESTADO
    const estadoRows = await db.query(
      "SELECT id FROM estado WHERE name = ?",
      [estado]
    );
    if (!estadoRows.length) throw new Error(`Estado '${estado}' no existe`);
    const estadoId = estadoRows[0].id;

    // 🔹 GRUPO
    const grupoRows = await db.query(
      "SELECT id FROM grupo WHERE name = ?",
      [grupo]
    );
    if (!grupoRows.length) throw new Error(`Grupo '${grupo}' no existe`);
    const grupoId = grupoRows[0].id;

    // 🔹 DESTINO (solo si es envío)
    let destinoId = null;

    if (esEnvio) {
      if (!destino) throw new Error("Falta destino para el envío");

      const destinoRows = await db.query(
        "SELECT id FROM local WHERE name = ?",
        [destino]
      );

      if (!destinoRows.length) {
        throw new Error(`Destino '${destino}' no existe`);
      }

      destinoId = destinoRows[0].id;

      // 🚫 evitar enviar al mismo lugar
      if (destinoId === localId) {
        throw new Error("El destino no puede ser igual al local");
      }
    }

    // 🔹 CACHE DE ITEMS (optimización)
    const itemsDB = await db.query("SELECT id, name FROM item");
    const itemMap = new Map();
    itemsDB.forEach(i => itemMap.set(i.name, i.id));

    // 🔹 INSERT DE ITEMS
    for (const it of item) {
      const { name, peso } = it;

      if (!name) throw new Error(`Item sin nombre`);
      if (peso == null) throw new Error(`Peso faltante en '${name}'`);
      if (peso <= 0) continue; // 👈 ignora pesos 0 o negativos

      const itemId = itemMap.get(name);
      if (!itemId) throw new Error(`Item '${name}' no existe`);

      const insertResult = await db.query(
        `
        INSERT INTO registro 
        (fecha, item_id, peso, estado_id, local_id, grupo_id, destino_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [fecha, itemId, peso, estadoId, localId, grupoId, destinoId]
      );

      resultado.push(insertResult.insertId);
    }

    // 🔹 Confirmar todo
    await db.query("COMMIT");

    return resultado;

  } catch (error) {
    // ❌ Si algo falla, revierte todo
    await db.query("ROLLBACK");
    throw error;
  }
}