const express = require('express');
const fs = require('fs');
const router = express.Router();

const catalogUrl = './serve/db/catalog.json';
const reviewUrl = './serve/db/review.json';
const regionsUrl = './serve/db/regions.json';
const citiesUrl = './serve/db/cities.json';

/**
 * Фильтрует каталог по выбранной странице и гендерному признаку
 * @param query - запрос => pages: ['women', 'men', 'kids', 'accessories'],
 *                          gender: 'Женщинам' | 'Мужчинам' | 'Мальчикам' | 'Девочкам' | 'Младенцам'
 * @param data
 * @returns {*}
 */
const filterCatalog = (query, data) => {
  let pages = undefined;
  let gender = undefined;
  const checkPage = (curPage) => {
    if (!pages) return true;
    return pages.includes(curPage);
  };
  const checkGender = (curGender) => {
    if (!gender) return true;
    return curGender === gender;
  };
  if ('pages' in query) pages = JSON.parse(query['pages']);
  if ('gender' in query) gender = query['gender'];
  let tmpData = JSON.parse(data);
  return tmpData.filter((el) => checkGender(el.gender) && checkPage(el.page));
};

/**
 * Считывает данные из каталога и возвращает список товаров
 */
router.get('/catalog', (req, res) => {
  fs.readFile(catalogUrl, 'utf-8', (err, data) => {
    if (err) {
      res.sendStatus(404, JSON.stringify({result: 0, text: err}));
    } else {
      let filter = undefined;
      if ('filter' in req.query) filter = JSON.parse(req.query.filter);
      let sortBy = undefined;
      if ('sortBy' in req.query) sortBy = JSON.parse(req.query.sortBy);
      let quantity = undefined;
      if ('quantity' in req.query) quantity = +req.query.quantity;
      let newData = filterCatalog(req.query, data);
      for (const key in filter) {
        newData = newData.filter((el) => {
          if (typeof el[key] === "string") {
            const regexp = new RegExp(filter[key], 'i');
            return regexp.test(el[key]);
          } else {
            return el[key].includes(filter[key]);
          }
        });
      }
      for (const key in sortBy) {
        switch (sortBy[key].toLowerCase()) {
          case 'desc':
            newData.sort((a, b) => {
              if (typeof a[key] === "string") {
                const ak = a[key].toLowerCase();
                const bk = b[key].toLowerCase();
                return bk.localeCompare(ak);
              } else {
                return b[key] - a[key];
              }
            });
            break;
          default:
            newData.sort((a, b) => {
              if (typeof b[key] === "string") {
                const ak = a[key].toLowerCase();
                const bk = b[key].toLowerCase();
                return ak.localeCompare(bk);
              } else {
                return a[key] - b[key];
              }
            });
        }
      }
      if (quantity) {
        res.send(JSON.stringify(newData.slice(0, quantity)));
      } else {
        res.send(JSON.stringify(newData));
      }
    }
  });
});

/**
 * Сортирует и возвращает только уникальные строки
 * @param data - массив строк
 * @returns {[]} - массив уникальных строк
 */
const selectDistinct = (data) => {
  let newData = data.sort((elA, elB) => typeof elB === "string" ? elA.localeCompare(elB) : elA - elB);
  return newData.filter((el, i, list) => {
    if (i < 1) return true;
    return el !== list[i-1];
  });
};

/**
 * Считывает данные из каталога и возвращает список категорий товаров
 */
router.get('/catalog/categories', (req, res) => {
  fs.readFile(catalogUrl, 'utf-8', (err, data) => {
    if (err) {
      res.sendStatus(404, JSON.stringify({result: 0, text: err}));
    } else {
      let newData = filterCatalog(req.query, data).map((el) => `${el.type}\n${el.category}`);
      newData = selectDistinct(newData);
      res.send(JSON.stringify(newData.map((el) => {
        const obj = el.split(`\n`);
        return { type: obj[0], category: obj[1] };
      })));
    }
  });
});

/**
 * Считывает данные из каталога и возвращает список брендов
 */
router.get('/catalog/brands', (req, res) => {
  fs.readFile(catalogUrl, 'utf-8', (err, data) => {
    if (err) {
      res.sendStatus(404, JSON.stringify({result: 0, text: err}));
    } else {
      const newData = filterCatalog(req.query, data).map((el) => el.brand);
      res.send(JSON.stringify(selectDistinct(newData)));
    }
  });
});

/**
 * Считывает данные из каталога и возвращает список доступных цветов
 */
router.get('/catalog/colors', (req, res) => {
  fs.readFile(catalogUrl, 'utf-8', (err, data) => {
    if (err) {
      res.sendStatus(404, JSON.stringify({result: 0, text: err}));
    } else {
      let newData = filterCatalog(req.query, data).map((el) => `${el.color.title}\n${el.color.value}`);
      newData = selectDistinct(newData);
      res.send(JSON.stringify(newData.map((el) => {
        const obj = el.split(`\n`);
        return { title: obj[0], value: obj[1] };
      })));
    }
  });
});

/**
 * Считывает данные из каталога и возвращает товар по указанному артикулу
 * со всеми связанными товарами
 */
router.get('/product', (req, res) => {
  fs.readFile(catalogUrl, 'utf-8', (err, data) => {
    if (err) {
      res.sendStatus(404, JSON.stringify({result: 0, text: err}));
    } else {
      if (!req.query.id) {
        res.sendStatus(404, JSON.stringify({result: 0, text: 'Товар отсутствует в каталоге'}));
        return;
      }
      data = JSON.parse(data);
      let newData = [data.find((el) => el.id === +req.query.id)];
      if (!newData[0]) {
        res.sendStatus(404, JSON.stringify({result: 0, text: 'Товар отсутствует в каталоге'}));
        return;
      }
      const links = newData[0].links;
      for (let i = 0; i < links.length; i++) {
        newData.push(data.find((el) => el.id === links[i]));
      }
      res.send(JSON.stringify(newData));
    }
  });
});

/**
 * Считывает отзывы из базы и возвращает список отзывов
 */
router.get('В', (req, res) => {
  fs.readFile(reviewUrl, 'utf-8', (err, data) => {
    if (err) {
      res.sendStatus(404, JSON.stringify({ result: 0, text: err }));
    } else {
      res.send(data);
    }
  });
});

/**
 * Считывает отзывы из базы и возвращает список отзывов
 */
router.get('/lists/regions', (req, res) => {
  fs.readFile(regionsUrl, 'utf-8', (err, data) => {
    if (err) {
      res.sendStatus(404, JSON.stringify({ result: 0, text: err }));
    } else {
      res.send(data);
    }
  });
});

/**
 * Считывает отзывы из базы и возвращает список отзывов
 */
router.get('/lists/cities', (req, res) => {
  fs.readFile(citiesUrl, 'utf-8', (err, data) => {
    if (err) {
      res.sendStatus(404, JSON.stringify({ result: 0, text: err }));
    } else {
      res.send(data);
    }
  });
});

module.exports = router;