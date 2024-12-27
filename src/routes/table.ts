import { Router, Request, Response } from 'express';
import { addTableToDatabase, updateTotal } from '../database/table';

const router: Router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { number, total, client } = req.body;

    await addTableToDatabase({number: number, total: total, client: client});

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

export default router;