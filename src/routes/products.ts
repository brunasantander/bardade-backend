import { Router, Request, Response } from "express";
import {
  addProductToDatabase,
  getProducts,
  getProductsByName,
} from "../database/product";

const router: Router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, price, type } = req.body;

    await addProductToDatabase({ name: name, price: price, type: type });

    res.json({ message: "Product added to firebase successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add product to database" });
  }
});

router.get("/", async (req, res) => {
  try {
    const products = await getProducts();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar produtos." });
  }
});

router.get("/:name", async (req: Request, res: Response) => {
  const { name } = req.params;
  res.json(await getProductsByName({ name: name }));
});

export default router;
