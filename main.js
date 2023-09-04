// imports
require('dotenv').config();
const express=require('express');
const mongoose=require('mongoose');
const session=require('express-session');

const app=express();
const PORT=process.env.PORT || 5500;

// database connection
mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true});
const db=mongoose.connection;
db.on('error',(err)=>{       // This is called when there is an error in connecting to the database.
    console.log(err);
});
db.once('open',()=>{         // This is called when the connection is successfull.
    console.log("Connected to the database");
})

// middlewares
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(
    session({
        secret: 'my secret key',
        saveUninitialized: true,
        resave: false
    })
);

app.use((req,resp,next)=>{
    resp.locals.message=req.session.message;
    delete req.session.message;
    next();
});

app.use(express.static("uploads"));

// set template engine
app.set("view engine", "ejs");

// app.get('/',(req,resp)=>{
//     resp.send("Hello World");
// });

// route prefix (middleware): Importing the routes from routes.js file.
app.use("", require("./routes/routes"));

app.listen(PORT, ()=>{
    console.log(`Server started at http://localhost:${PORT}`);
});