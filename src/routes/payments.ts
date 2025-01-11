import { Router, Request, Response } from 'express';
import { addPayment, getPayments } from '../database/payment';

const router: Router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { price, method, tableId } = req.body;

    await addPayment({ tableId: tableId, price: price, method: method});

    res.json({ message: 'Payment added to firebase successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add payment to database' });
  }
});

router.get("/", async (req, res) => {
  try {
    const payments = await getPayments();
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar pagamentos." });
  }
});

export default router;
