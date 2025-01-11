import { Router, Request, Response } from 'express';
import { addCartToDatabase, deleteTable, getTable, getTableInfo, updateTotal } from '../database/table';

const router: Router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { products, tableNumber, total, tableName } = req.body;
    await addCartToDatabase({ products: products, tableNumber: tableNumber, total: total, client: tableName });
    res.json({ message: 'Table added to firebase successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add table to database' });
  }
});

router.put('/', async (req: Request, res: Response) => {
  try {
    const { total, id } = req.body;

    await updateTotal({total: total, tableId: id});

    res.json({ message: 'Total updated successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update' });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const tables = await getTable();
    res.status(200).json(tables);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update' });
  }
});

router.get('/:tableId', async (req: Request, res: Response) => {
  try {
    const { tableId } = req.params;
    const info = await getTableInfo(tableId);
    res.status(200).json(info);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get info' });
  }
});

router.delete('/:tableId/:method', async (req: Request, res: Response) => {
  try {
    const { tableId, method } = req.params;
    const info = await deleteTable(tableId, method);
    res.status(200).json(info);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete table' });
  }
});

export default router;