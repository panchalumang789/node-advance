import { z } from 'zod';
import { FastifyPluginAsync } from 'fastify';

import { specificAdminAuth } from '../../plugins/auth';
import { ProductController } from '../../controllers/products';
import { validateProductData } from '../../middleware/products';
import { createProductSchema, getAllProductsSchema } from '../../schema/products';

const productsRoutes: FastifyPluginAsync = async (app) => {
  const productController = new ProductController();

  app.get('/products', {
    schema: {
      tags: ['Product'],
      response: { 200: z.object({ products: z.array(getAllProductsSchema) }) },
    },
    preHandler: app.rateLimit(),
    handler: productController.getAllProducts,
  });

  app.get('/product/:id', {
    schema: {
      tags: ['Product'],
      params: z.object({ id: z.string().uuid('Invalid product is') }),
      response: { 200: z.object({ product: getAllProductsSchema }) },
    },
    preHandler: app.rateLimit(),
    handler: productController.getProductById,
  });

  app.post('/product', {
    schema: {
      tags: ['Product'],
      security: [{ bearerAuth: [] }],
      body: createProductSchema,
      response: { 200: z.object({ product: getAllProductsSchema }) },
    },
    preHandler: [specificAdminAuth, validateProductData],
    handler: productController.createProduct,
  });

  app.put('/product/:id', {
    schema: {
      tags: ['Product'],
      security: [{ bearerAuth: [] }],
      params: z.object({ id: z.string().uuid('Invalid product is') }),
      body: createProductSchema,
      response: { 200: z.object({ product: getAllProductsSchema }) },
    },
    preHandler: [app.rateLimit(), specificAdminAuth, validateProductData],
    handler: productController.updateProduct,
  });

  app.delete('/product/:id', {
    schema: {
      tags: ['Product'],
      security: [{ bearerAuth: [] }],
      params: z.object({ id: z.string().uuid('Invalid product is') }),
      response: { 200: z.object({ message: z.string() }) },
    },
    preHandler: [app.rateLimit(), specificAdminAuth],
    handler: productController.deleteProduct,
  });
};

export { productsRoutes };
