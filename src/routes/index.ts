import express, { Router } from 'express';
import productsRoutes from './products';
import ordersRoutes from './order';
import tableRoutes from './table';
import paymentsRoutes from './payments';

const router: Router = express.Router();

router.use('/products', productsRoutes);
router.use('/orders', ordersRoutes);
router.use('/table', tableRoutes);
router.use('/payments', paymentsRoutes);

export default router;
