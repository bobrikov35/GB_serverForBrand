const express = require('express');
const fs = require('fs');
const handler = require('./handler');
const router = express.Router();
const catalogUrl = './serve/db/catalog.json';
const cartUrl = './serve/db/cart_user.json';

/**
 * Считывает данные из корзины и возвращает их
 */
router.get('/', (req, res) => {
  fs.readFile(cartUrl, 'utf-8', (err, cart) => {
      if (err) {
        res.sendStatus(404, JSON.stringify({ result: 0, text: err }));
      } else {
        fs.readFile(catalogUrl, 'utf-8', (err, catalog) => {
          if (err) {
            res.sendStatus(404, JSON.stringify({result: 0, text: err}));
          } else {
            const data = [];
            catalog = JSON.parse(catalog);
            cart = JSON.parse(cart);
            for (let i = 0; i < cart.length; i++) {
              const product = catalog.find((el) => el.id === cart[i].id);
              if (product) {
                data.push(Object.assign(cart[i], product));
              }
            }
            res.send(JSON.stringify(data));
          }
        });
      }
  });
});

/**
 * Передает управление handler-у с действием 'add' - добавляет новый товар в корзину
 */
router.post('/', (req, res) => {
  handler(req, res, 'add', cartUrl);
});

/**
 * Передает управление handler-у с действием 'change' - добавляет товар в корзину
 */
router.put('/', (req, res) => {
  handler(req, res, 'change', cartUrl);
});

/**
 * Передает управление handler-у с действием 'del' - убирает товар из корзины
 */
router.delete('/', (req, res) => {
  handler(req, res, 'del', cartUrl);
});

/**
 * Передает управление handler-у с действием 'clear' - очищает корзину
 */
router.delete('/clr', (req, res) => {
  handler(req, res, 'clear', cartUrl);
});

module.exports = router;