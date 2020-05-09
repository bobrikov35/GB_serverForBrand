# GB_serverForBrand
Сервер для интернет-магазина Brand

# Установка проекта:
yarn install

# Запуск сервера:
yarn serve | node serve[/index]

# В магазине используется порт 3030

# URL:

# Каталог:
http://localhost:3030/api/catalog
#   в "catalog" можно использовать запросы:
    .../?filter={"[поле]":"значение"[,...]} => фильтрация по значению в выбранном поле
    .../?sortBy={"поле":"asc|desc"[,...]}   => сортировка по указанному полю
    .../?quantity=[число]                   => ограничение количество получаемых товаров

# Категории:
http://localhost:3030/api/catalog/categories
# Бренды:
http://localhost:3030/api/catalog/brands
# Цвета:
http://localhost:3030/api/catalog/colors
#   в "categories", "brands" и "colors":
    .../?pages=["men","women","kids","accessories"]
    .../?gender=Женщинам[Мужчинам, Мальчикам, Девочкам, Младенцам]

# Товар из каталога по артикулу:
http://localhost:3030/api/product/
#   в "product" необходимо передавать id:
    .../?id=[артикул]     => список товаров: [0] - это выбранный товар, [1]..[n] - зависимые по цветам

# Корзина:
http://localhost:3030/api/cart
