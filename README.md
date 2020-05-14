# GB_serverForBrand

Сервер для интернет-магазина Brand

# Установка проекта:

yarn install

# Запуск сервера:

yarn serve | node serve[/index]

# URL:

http://localhost:3030

# Каталог:

http://localhost:3030/api/catalog

можно использовать запросы:

    /?page="men" | "women" | "kids" | "accessories" => выборка по одному из указанных значений
    /?categories=["значение"[, ...]] => выборка товаров, у которых совпадает любая из категорий
    /?brands=["значение"[, ...]] => выборка товаров, у которых совпадает любой из брендов
    /?colors=["значение"[, ...]] => выборка товаров, у которых совпадается любой из цветов
    /?filter={"[поле]":"значение"[, ...]} => фильтрация по значению в выбранном поле
    /?sortBy={"поле":"asc|desc"[, ...]} => сортировка по указанному полю
    /?quantity=[число] => ограничение количество получаемых товаров

# Категории:

http://localhost:3030/api/catalog/categories

можно использовать запрос:

    /?page="men" | "women" | "kids" | "accessories" => выборка по одному из указанных значений

# Бренды:

http://localhost:3030/api/catalog/brands

можно использовать запрос:

    /?page="men" | "women" | "kids" | "accessories" => выборка по одному из указанных значений

# Цвета:

http://localhost:3030/api/catalog/colors

можно использовать запрос:

    /?page="men" | "women" | "kids" | "accessories" => выборка по одному из указанных значений

# Товар из каталога по артикулу:

http://localhost:3030/api/product/

обязательно должен передаваться артикул товара:

    /?id=[артикул] => возвращает список товаров: 0 - это выбранный товар, 1...n - зависимые по цветам

# Корзина:

http://localhost:3030/api/cart

# Списки:

Отзывы:

http://localhost:3030/api/review

Регионы:

http://localhost:3030/api/lists/regions

Города:

http://localhost:3030/api/lists/cities
