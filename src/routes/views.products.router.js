import { Router } from 'express';
const router = Router();
import productManager from '../dao/mongodb-managers/ProductManager.js';

const auth = (req, res, next) => {
    if(req.session.user){
        return next();
    }else if(!req.session.user){
        res.redirect('/sessions/login');
    };
};

// Get
router.get('/', auth, async (req, res) => {
    try {
        const {limit, page, sort, query} = req.query;
        const products = await productManager.getProducts(limit, page, sort, query);

        products.prevLink = products.hasPrevPage ? `/products?page=${products.prevPage}` : null;
        products.nextLink = products.hasNextPage ? `/products?page=${products.nextPage}` : null;
        
        if(products.totalPages > 1){
            products.totalPagesArray = [];
            for (let i = 1; i <= products.totalPages; i++) {
                products.totalPagesArray.push(i);
            };
        }; 

        res.status(200).render('products', {
            script: 'index',
            style: 'index',
            title: 'Productos',
            products: products
        });
  
    } catch (error) {
        res.status(500).send(`Error trying to fetch all the products: ${error}`);
    };
  
});

// Get by ID
router.get('/:pid', auth, async (req, res) => {
    const productId = req.params.pid;

    try {
        const product = await productManager.getProductById(productId);
  
        res.status(200).render('product', {
            style: 'index',
            title: `${product.title}`,
            product: product.toObject()
        });
    } catch (error) {
        res.status(500).send(`Error trying to fetch product by id: ${error}`);
    };
});

export default router;