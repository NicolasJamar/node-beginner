const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const {logger} = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const PORT = process.env.PORT || 3500;

// custom middleware logger
app.use(logger)

// Cross Origin Resource Sharing
const whitelist = ['https://www.yoursite.com', 'https://yoursite.com', 'http://127.0.0.1:5500', 'http://localhost:3500']
const corsOptions = {
  origin: (origin, callback) => {
    // if the domain is in the whitelist OR No origin
    if(whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true) // the first argument is the error, the 2nd allowed the origin
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded data
// in other words, form data :
// 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false })); 

// built-in middleware for json
app.use(express.json());

// serve static files
app.use(express.static(path.join(__dirname, '/public')));


app.get('^/$|index(.html)?', (req, res) => {
  res.sendFile(path.join( __dirname, 'views', 'index.html'))
})

app.get('/new-page(.html)?', (req, res) => {
  res.sendFile(path.join( __dirname, 'views', 'new-page.html'))
})

app.get('/old-page(.html)?', (req, res) => {
  res.redirect(301, '/new-page.html') //302 by default
})

// Route handlers
app.get('/hello(.html)?', (req, res, next) => {
  console.log('attempted to load hello.html')
  next();
}, (req, res) => {
  res.send('Hello World !')
})

// Chaining route handlers
const one = (req, res, next) => {
 console.log('one');
 next(); 
}

const two = (req, res, next) => {
  console.log('two');
  next(); 
 }

 const three = (req, res) => {
  console.log('three');
  res.send('Finished!');
 }

app.get('/chain(.html)?', [one, two, three]);

// Manage 404
app.all('*', (req, res) => {
  res.status(404);
  if(req.accepts('html')) {
    res.sendFile(path.join( __dirname, 'views', '404.html'))
  } else if(req.accepts('json')) {
    res.json({ error: "404 Not Found"})
  } else {
    res.type('txt').send("404 Not Found")
  }
})

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


// DEFINITIONS
// Middleware is anything beteween the request and the response
// app.use() is most of the time used by middleware. it doesn't accept regex

// app.get() & app.all() are used for the routes. It accepts regex