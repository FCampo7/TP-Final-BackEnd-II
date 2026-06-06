import ProductRepository from "../repositories/ProductRepository.js";

const productRepo = new ProductRepository();

export const getProducts = async (req, res) => {
    try {
        const { category } = req.query;
        const products = await productRepo.getProducts(category ? { category } : {});
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "error al obtener los productos", error });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productRepo.getProductById(pid);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "error al obtener el producto", error });
    }
};

export const createProduct = async (req, res) => {
    try {
        const product = req.body;
        if (product.status == "on") {
            product.status = true;
        } else {
            product.status = false;
        }
        const newProduct = await productRepo.createProduct({ 
            ...product, 
            thumbnails: req.files?.map(file => file.filename) || [] 
        });
        req.app.get("socketServer").emit("new-product", newProduct);
        res.status(200).json({ message: "producto agregado", newProduct });
    } catch (error) {
        res.status(500).json({ message: "error al agregar el producto", error });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const update = req.body;
        const { pid } = req.params;
        const updatedProduct = await productRepo.updateProduct(pid, update);
        res.status(200).json({ message: "producto actualizado", updatedProduct });
    } catch (error) {
        res.status(500).json({ message: "error al actualizar el producto", error });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { pid } = req.params;
        const deletedProduct = await productRepo.deleteProduct(pid);
        res.status(200).json({ message: "producto borrado", deletedProduct });
    } catch (error) {
        res.status(500).json({ message: "error al borrar el producto", error });
    }
};

export const getStockReports = async (req, res) => {
    try {
        const stock = await productRepo.getLowStockReports();
        res.status(200).json({ message: "reporte de stock generado", stock });
    } catch (error) {
        res.status(500).json({ message: "error al generar el reporte de stock", error });
    }
};
