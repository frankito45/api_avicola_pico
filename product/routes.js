import { Router } from "express";

import { crearRegistro, obtenerRegistro, obtenerRegistroById,obtenerRegistroBygrupo } from "../database/controles.js";

const router = Router()

  
// get
router.get('/',obtenerRegistro);
// get por grup
router.get('/grupo/:grupo',obtenerRegistroBygrupo)

// get por id
router.get('/:id',obtenerRegistroById)


// post
router.post('/',crearRegistro)




export default router