import { Router } from "express";
import  product from "../product/routes.js"

   
const router = Router()

router.use('/stock',product)

export default router