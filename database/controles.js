import { GetDatos,GetDatosById, GetDatosGrup } from "../database/registroRepositori.js";
import { CrearRegistro } from "../servise/registroServise.js";


// POST /registro
export async function crearRegistro(req, res) {
   const data = req.body
      console.log(JSON.stringify(data, null, 2));
    const { local, fecha, item, estado, grupo} = data
    if (!local || !fecha || !item || !estado || !grupo){
        return res.status(400).json({
        ok: false,
        message: "La estructura recibida no coincide con la esperada",
        recibidos: data
    });    
    }
    try {
        const resultado = await CrearRegistro(data);
        res.status(201).json({ ok: true, resultado });

} catch(error){
    console.error(error)
    res.status(500).json({error:'error en la peticion'})
}
}



// GET /registro
export async function obtenerRegistro(req, res) {
    console.log("entrando a la api")
     
    try {
            const rows = await GetDatos()
            return res.status(200).json(rows)
    
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al obtener stock" });
        }
}


export async function obtenerRegistroById(req, res) {
     const {id} = req.params
     console.log("id:", id);
              try {
         const rows = await GetDatosById(id)
     res.status(200).json(rows)
     } catch(error){
         console.error(error)
         res.status(500).json({error:'error en la peticion'})
     }
}

export async function obtenerRegistroBygrupo(req, res) {
     const { grupo } = req.params
     console.log("Grupo recibido:", grupo);
              try {
         const rows = await GetDatosGrup(grupo)
     res.status(200).json(rows)
     } catch(error){
         console.error(error)
         res.status(500).json({error:'error en la peticion'})
     }
}
