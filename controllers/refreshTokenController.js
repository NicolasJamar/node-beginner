const User = require('../model/User');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async(req, res) => {
  const cookies = req.cookies;
  //if we don't have cookie and jwt property in it
  if(!cookies?.jwt) return res.sendStatus(401)  
  const refreshToken = cookies.jwt;
  // once we get back the refreshToken from the cookie, we delete it
  res.clearCookie('jwt', { httpOnly: true, sameSite: "None", secure: true })

  const foundUser = await User.findOne({ refreshToken }).exec();

  //Detected refreshtoken reuse
  //if we have a token but not found an user
  if(!foundUser) {
    jwt.verify(
      refreshToken, 
      process.env.REFRESH_TOKEN_SECRET,
      // we will contact the DB so async
      async (err, decoded) => {
        //if the refresh token is expired or not valid
        if(err) return res.sendStatus(403) // Forbidden
        //if we have a token not expired but already use once
        //we erase the array of tokens in the DB
        const hackedUser = await User.findOne({username : decoded.username}).exec();
        hackedUser.refreshToken = [];
        const response = await hackedUser.save();
        console.log(response);
      }
    )
    return res.sendStatus(403) // Forbidden
  }

  const newRefreshTokenArray = foundUser.refreshToken.filter( rt => rt !== refreshToken);

  // evaluate JWT
  jwt.verify(
    refreshToken, 
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      //if the token is expired we reassign new token(s)
      if(err) {
        console.log('expired token');
        foundUser.refreshToken = [...newRefreshTokenArray];
        const result = await foundUser.save();
        console.log('expired token res', result);
      }
      if(err || foundUser.username !== decoded.username) return res.sendStatus(403); // invalid token
      
      //if the refreshToken is still valid, we send a new accessToken
      const roles = Object.values(foundUser.roles).filter( role => role !== undefined );
      const accessToken = jwt.sign(
        { "UserInfo" : {
            "username": decoded.username,
            "roles": roles
          }
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: '10s'}
      )

      //we send a new refreshToken too
      const newRefreshToken = jwt.sign(
        { "username": foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' }
      );
      // Saving refreshToken with current user
      foundUser.refreshToken = [...newRefreshTokenArray , newRefreshToken];
      const result = await foundUser.save();
      console.log(result);

      //we store the refreshToken in a cookie httpOnly
      res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: "None", maxAge: 24*60*60*1000 }) //with httpOnly, the cookie is not available by the JS

      res.json({ accessToken })
    }
  )
  
}

module.exports = { handleRefreshToken };