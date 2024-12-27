import { Router, Request, Response } from 'express';
import { addOrdersItemToDatabase, addOrdersToDatabase, updateStatus } from '../database/order';

const router: Router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { status, tableId } = req.body;

    await addOrdersToDatabase({ status: status, table_id: tableId});

    res.json({ message: 'Order added to firebase successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add order to database' });
  }
});

router.put('/', async (req: Request, res: Response) => {
  try {
    const { status, id } = req.body;

    await updateStatus({ status: status, id: id});

    res.json({ message: 'Order status updated successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update' });
  }
});

router.post('/itens', async (req: Request, res: Response) => {
  try {
    const { productId, orderId, amount, price } = req.body;

    await addOrdersItemToDatabase({product_id: productId, order_id: orderId, amount: amount, price: price});

    res.json({ message: 'Order added to firebase successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add order to database' });
  }
});

export default router;
