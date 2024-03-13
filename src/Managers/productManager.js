import fs from 'fs'

export class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
    }

    #addId() {
        if (this.products.length === 0) return 1;
        return this.products.at(-1).id + 1; // metodo at, si colocas -1 accedes al ultimo elemento del array
    }

    #findCode(code) {
        let find = this.products.find(elem => elem.code === code)
        if (find === undefined) return false;
        else return true;
    }

    #findIndice(id){
        const indice = this.products.map(product => product.id).indexOf(id)
        return indice
    }

    async #salveProduct() {
        try {
            const json = JSON.stringify(this.products, null, '\t')
            await fs.promises.writeFile(this.path, json)
        } catch (Error) {
            console.error(error)
        }
    }

    async getProducts() {
        try {
            const json = await fs.promises.readFile(this.path, 'utf-8')
            if (json === "") return 'la lista esta vacia!!';
            this.products = JSON.parse(json);
            return this.products
        } catch (error) {
            if (error.code == "ENOENT") return [];
            console.error(error)
        }
    }

    async addProduct(product) {
        await this.getProducts();

        if (this.#findCode(product.code)) return 'el codigo del producto ya se encuentra cargado!'
        if(product.status === undefined) product.status = true; // ver si se puede reemplazar por product.status = product.status || true;
        const id = this.#addId();
        product = {id: id, ...product}

        this.products.push(product);
        this.#salveProduct();
        return 'se cargo el producto'
    }

    async getProductById(id) {
        await this.getProducts();

        let product;
        product = this.products.find(elem => elem.id === id)
        if (product === undefined) return 'Not Found'
        return product
    }

    async updateProduct(id, campoActualizar, cambio) {
        await this.getProducts();

        const indice = this.#findIndice(id)
        if (indice === -1) return "no hay producto a actualizar"

        const producto = this.products[indice]
        Object.defineProperty(producto, campoActualizar, { // metodo para cambiar la propiedad de un objeto, talves mejor cambiarlo 
            value: cambio,
            writable: true,
            configurable: true,
            enumerable: true,
        })
        this.products[indice] = producto;
        await this.#salveProduct()
        return "Producto actualizado:"
    }

    async deleteProduct(id) {
        await this.getProducts();

        const index = this.#findIndice(id)
        if (index === -1) return "no hay producto a eliminar"
        this.products.splice(index, 1)
        await this.#salveProduct()
        return "se elimino el producto"
    }
}