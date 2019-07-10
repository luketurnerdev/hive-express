//Express server setup
const express = require('express');
const app = express();
const port = 3000;

//Root page 
app.get('/', (req,res) => {
    res.send('Testing!');
});

//Application-level middleware

app.use((req,res) => {
    console.log('Time: ', Date.now());
    next();
});

//Route specific middleware

app.use("/", (req,res,next) => {
    console.log('This is middleware for a specific route.');
});


//Port listening
app.listen(port, () => console.log(`Express running on port ${port}`));