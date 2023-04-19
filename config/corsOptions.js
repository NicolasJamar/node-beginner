// Cross Origin Resource Sharing
const whitelist = [
  'https://www.yoursite.com', 
  'https://yoursite.com', 
  'http://127.0.0.1:5500', 
  'http://localhost:3500'
]

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

module.exports = corsOptions;