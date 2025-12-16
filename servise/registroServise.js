import db from "../database/bd.js";

export async function CrearRegistro(data) {
    const { fecha, item, estado, local, grupo } = data;

    const resultado = [];

    // VALIDAR Y OBTENER IDS POR NOMBRE 
    const [localRow] = await db.query("SELECT id FROM local WHERE name = ?", [local]);
    if (!localRow) throw new Error(`Local '${local}' no existe`);

    const [estadoRow] = await db.query("SELECT id FROM estado WHERE name = ?", [estado]);
    if (!estadoRow) throw new Error(`Estado '${estado}' no existe`);

    const [grupoRow] = await db.query("SELECT id FROM grupo WHERE name = ?", [grupo]);
    if (!grupoRow) throw new Error(`Grupo '${grupo}' no existe`);

    // RECORRER ITEMS Y GUARDAR UNO POR UNO 
    for (const it of item) {
        const nombreItem = it.name;
        const pesoItem = it.peso;

        if (!nombreItem) throw new Error(`Item sin nombre`);
        if (pesoItem == null) throw new Error(`Peso faltante en item '${nombreItem}'`);

        const [itemRow] = await db.query(
            "SELECT id FROM item WHERE name = ?",
            [nombreItem]
        );
        if (!itemRow) throw new Error(`Item '${nombreItem}' no existe`);

        const insertResult = await db.query(`
            INSERT INTO registro (fecha, item_id, peso, estado_id, local_id, grupo_id)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [
            fecha,
            itemRow.id,
            pesoItem,
            estadoRow.id,
            localRow.id,
            grupoRow.id
        ]);

        resultado.push(insertResult.insertId);
    }

    return resultado;
}
