import express from "express"
import ProductManager from "./productManager.js"

const manager = new ProductManager('./Data/Archivo.json')
const app = express()
const PORT = 8080


app.get('/products/', async (req, res)=> {
    const limit = req.query.limit
    if (!limit) return res.send(await manager.getProducts())
    let respuesta = await manager.getProducts()
    respuesta = respuesta.slice(0, parseInt(limit))
    return res.send(respuesta)
})

app.get('/products/:pid', async (req, res)=> {
    const productId = parseInt(req.params.pid)
    const respuesta = await manager.getProductById(productId)
    return res.send(respuesta)
})

app.listen(PORT, () => {
    console.log(`escuchando en el puerto ${PORT}`
)}).on('error', (error)=> {
    console.error(`error en init server on port ${PORT}`)
})