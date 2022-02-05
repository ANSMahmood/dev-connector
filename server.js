const express = require('express');
const app = express();
const dataBaseConnection = require('./config/db');
const path = require("path");

// Call the database to connect
dataBaseConnection();

// body parser is necessary
app.use(express.json( {entended: false} ));
// Defining All roots in Server
app.use('/api/users', require('./Routes/api/users'));
app.use('/api/profiles', require('./Routes/api/profiles'));
app.use('/api/posts', require('./Routes/api/posts'));
app.use('/api/auth', require('./Routes/api/auth'));

app.use(express.static(path.join(__dirname, "build")));

if(process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));

    app.get("/", (req, res) => {
        // res.json({ message: "Welcome to starter template" });
        res.sendFile(path.resolve(__dirname, "client","build", "index.html"));
      });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Server is Running on PORT " + PORT);
});










// const express = require('express');
// const app = express();
// const dbConnection = require('./config/db');

// // database connection
// dbConnection();

// // adding middleWare for parsing the body 

// app.use(express.json( {extended: false} )); // without it body will give undefined

// // Defining routes
// app.use('/api/users',require('./Routes/api/users'));
// app.use('/api/auth',require('./Routes/api/auth'));
// app.use('/api/profiles',require('./Routes/api/profiles'));
// app.use('/api/posts',require('./Routes/api/posts'));

// app.use('/', (req, res) => {
//     console.log("second get request");
// });
// app.use((req, res) => {
//     req.status(404).send('Page not found')
// });
// let PORT = 3000;
// app.listen(PORT, () =>{
//     console.log("Listening On PORT" + " " + PORT)
// });