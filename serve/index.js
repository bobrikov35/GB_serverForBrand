const express = require('express');
const fs = require('fs');
const cartRouter = require('./cartRouter');
const apiRouter = require('./apiRouter');
const app = express();

app.use(express.json());
app.use('/photos', express.static('./serve/db/photos/'));
app.use('/api/cart', cartRouter);
app.use('/api', apiRouter);

const port = process.env.PORT || 3030;
app.listen(port, () => {
  console.log(`Server for store "Brand" is running on port ${port}`);
});