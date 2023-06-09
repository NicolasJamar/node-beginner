const User = require('../model/User');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async(req, res) => {
  const cookies = req.cookies;
  if(!cookies?.jwt){ //if we don't have cookie and jwt property in it
    return res.sendStatus(401)
  }
  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({ refreshToken }).exec();
  if(!foundUser) return res.sendStatus(403); // Forbidden
  // evaluate JWT
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
      if(err || foundUser.username !== decoded.username) return res.sendStatus(403); // invalid token
      const roles = Object.values(foundUser.roles).filter( role => role !== undefined );
      const accessToken = jwt.sign(
        { "UserInfo" : {
            "username": decoded.username,
            "roles": roles
          }
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: '30s'}
      )
      res.json({ accessToken })
    }
  )
  
}

module.exports = { handleRefreshToken };