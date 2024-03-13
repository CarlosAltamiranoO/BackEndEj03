
import { randomUUID } from 'crypto';
import fs from 'fs';

export class cartManager {
    constructor(path) {
        this.path = path
        this.carts = []
    }

    async getCarts() {
        try {
            const json = await fs.promises.readFile(this.path, 'utf-8')
            if (json === "") return true
            this.carts = JSON.parse(json)
            return false
        } catch (error) {
            console.error(error)
        }
    }
    async salveCarts() {
        try {
            const json = JSON.stringify(this.carts, null, 2)
            await fs.promises.writeFile(this.path, json)
            return true
        } catch (error) {
            console.error(error)
            return false

        }
    }

    async getcartById(id) {
        try {
            await this.getCarts()
            console.log(id)
            const cart = this.carts.find(((cart) => cart.id === id))
            if (cart === undefined) return "no existe el carrito solicitado"
            return cart
        } catch (error) {
            console.error(error)
        }

    }
    async addcart() {
        try {
            await this.getCarts()
            const newCart = { id: randomUUID(), products: [] }
            this.carts.push(newCart)
            if (await this.salveCarts()) return newCart.id
            else return " hubo un error al crear el carrito"

        } catch (error) {
            console.log(error)
        }
    }
    async addToCart(cid, pid) {
        if (await this.getCarts()) return "no hay ningun carrito cargado"
        const carrito = await this.getcartById(cid)
        if (carrito === "no existe el carrito solicitado") return "no existe el carrito solicitado"
        const indexCart = this.carts.findIndex(c => c.id === cid)
        const existingProduct = carrito.products.find(product => product.id === pid)
        if (existingProduct) existingProduct.quantity += 1
        else carrito.products.push({ id: pid, quantity: 1 })
        this.carts[indexCart] = carrito;
        await this.salveCarts()
        return "se actualizo el carrito"
    }
}