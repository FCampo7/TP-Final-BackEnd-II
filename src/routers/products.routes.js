import { json, Router, urlencoded } from "express";
import { productModel } from "../model/productModel.js";
import { uploader } from "../utils.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const { category } = req.query;
        const products = await productModel.find(category ? { category } : {});
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "error al obtener los productos", error });
    }
});

router.delete("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const deletedProduct = await productModel.findByIdAndDelete(pid);
        res.status(200).json({ message: "producto borrado", deletedProduct });
    } catch (error) {
        res.status(500).json({ message: "error al borrar el producto", error });
    }
});

// ENDPOINT DE CONTROL DE STOCK
router.get("/stock", async (req, res) => {
    try {
        const stock = await productModel.aggregate(
            [
                {
                    $match: {
                        stock: { $lt: 10 }
                    }
                },
                {
                    $project: {
                        title: "$title",
                        stock: "$stock",
                        category: "$category"
                    }
                },
                {
                    $group: {
                        _id: "$category",
                        products: {
                            $push: {
                                title: "$title",
                                stock: "$stock"
                            }
                        }
                    }
                },
                {
                    $merge: {
                        into: "stock_reports"
                    }
                }
            ]);
        res.status(200).json({ message: "reporte de stock generado", stock });
    } catch (error) {
        res.status(500).json({ message: "error al generar el reporte de stock", error });
    }
})

router.get("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productModel.findById(pid)
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "error al obtener el producto", error });
    }
});

router.use(urlencoded({ extended: true }));
router.use(json());

router.post("/",
    uploader.array("thumbnails", 10),
    async (req, res) => {
        try {
            const product = req.body;
            if (product.status == "on") {
                product.status = true
            } else {
                product.status = false
            }
            const newProduct = await productModel.create({ ...product, thumbnails: req.files?.map(file => file.filename) || [] });
            req.app.get("socketServer").emit("new-product", newProduct);
            res.status(200).json({ message: "producto agregado", newProduct });
        } catch (error) {
            res.status(500).json({ message: "error al agregar el producto", error });
        }
    });

router.put("/:pid", async (req, res) => {
    try {
        const update = req.body;
        const { pid } = req.params;
        const updatedProduct = await productModel.findByIdAndUpdate(pid, update);
        res.status(200).json({ message: "producto actualizado", updatedProduct });
    } catch (error) {
        res.status(500).json({ message: "error al actualizar el producto", error });
    }
});
export default router;