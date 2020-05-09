const express = require('express');
const fs = require('fs');
const cartRouter = require('./cartRouter');
const apiRouter = require('./apiRouter');
const app = express();

/*
http://localhost:3030/api
  /catalog                => каталог товаров
    /?filter={"[поле]":"значение"[,...]}&sortBy={"поле":"asc|desc"[,...]}&quantity=[число]
      возвращает список товаров
  /catalog/categories     => категории товаров
  /catalog/brands         => бренды товаров
  /catalog/colors         => цвета товаров
    Работает со всеми запросами к каталогу:
      /?pages=["men","women","kids","accessories"]&gender=Женщинам[Мужчинам, Мальчикам, Девочкам, Младенцам]
        возвращает список товаров, соответствующих запросу
  /product/               => товар каталога
    /?id=[артикул]
      возвращает список товаров: [0] - это выбранный товар, [1]..[n] - зависимые по цветам
   /cart                  => корзина товаров
*/

app.use(express.json());
app.use('/photos', express.static('./serve/db/photos/'));
app.use('/api/cart', cartRouter);
app.use('/api', apiRouter);

const port = process.env.PORT || 3030;
app.listen(port, () => {
  console.log(`Server for store "Brand" is running on port ${port}`);
});