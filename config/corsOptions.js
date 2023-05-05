// Cross Origin Resource Sharing
const allowedOrigins = require('./allowedOrigins');

const corsOptions = {
  origin: (origin, callback) => {
    // if the domain is in the whitelist OR No origin
    if(allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true) // the first argument is the error, the 2nd allowed the origin
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  optionsSuccessStatus: 200
}

module.exports = corsOptions;