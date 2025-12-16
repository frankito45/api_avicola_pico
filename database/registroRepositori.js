import db from '../database/bd.js'


export async function GetDatos() {
    const rows = await db.query(`
        SELECT 
            registro.id,
            registro.fecha,
            item.name AS item,
            registro.peso,
            estado.name AS estado,
            local.name AS local,
            grupo.name AS grupo
        FROM registro
        LEFT JOIN item ON registro.item_id = item.id
        LEFT JOIN estado ON registro.estado_id = estado.id
        LEFT JOIN local ON registro.local_id = local.id
        LEFT JOIN grupo ON registro.grupo_id = grupo.id
    `);
    console.log(rows)

    return rows; 
}

export async function GetDatosById(id) {
    return await db.query(`
        SELECT 
        registro.id,
        registro.fecha,
        item.name AS item,
        registro.peso,
        estado.name AS estado,
        local.name AS local,
        grupo.name AS grupo
        FROM registro
        LEFT JOIN item ON registro.item_id = item.id
        LEFT JOIN estado ON registro.estado_id = estado.id
        LEFT JOIN local ON registro.local_id = local.id
        LEFT JOIN grupo ON registro.grupo_id = grupo.id
        WHERE registro.id = ?
        `,[id]);
    }

    // consulta 
export async function GetDatosGrup(grupoName) {
    return await db.query(`
      SELECT 
    registro.id,
    registro.fecha,
    item.name AS item,
    registro.peso,
    estado.name AS estado,
    local.name AS local,
    grupo.name AS grupo
FROM registro
INNER JOIN grupo ON registro.grupo_id = grupo.id
LEFT JOIN item   ON registro.item_id = item.id
LEFT JOIN estado ON registro.estado_id = estado.id
LEFT JOIN local  ON registro.local_id = local.id
WHERE grupo.name = ?;


    `,[grupoName]); 
}