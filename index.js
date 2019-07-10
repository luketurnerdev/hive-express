const app = require('./app');
//TODO - change port to process.env reference
const port = 3000;
const fs = require('fs');

app.listen(port, () => console.log(`Server is listening on port ${port}`));