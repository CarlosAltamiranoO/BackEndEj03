import {Router} from "express"
import {cartManager} from "../src/Managers/cartManager.js"

export const cartRouter = Router()
const Manager = new cartManager('./Data/carts.json')

cartRouter.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cid = req.params.cid
        const pid = req.params.pid
        const respuesta = await Manager.addToCart(cid, pid)
        res.json(respuesta)

    } catch (error) {
        console.log(error)
        res.send('Los datos ingresados son incorrectos')
    }

})

cartRouter.post('/', async (req, res) => {
    const respuesta = await Manager.addcart()
    res.json(respuesta)
})

cartRouter.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid
        let respuesta = await Manager.getcartById(cartId)
        res.json(respuesta)
    } catch (error) {
        console.log(error)
        res.send('Los datos ingresados son incorrectos')
    }
})
