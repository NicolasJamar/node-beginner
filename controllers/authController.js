const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async(req, res) => {
  const cookies = req.cookies;
  console.log(`cookie available at login ${JSON.stringify(cookies.jwt)}`);
  const { user, pwd } = req.body;
  if(!user || !pwd ){
    res.status(400).json({ 'message': 'Username and password are required' })
  }
  const foundUser = await User.findOne({username: user}).exec();
  if(!foundUser) return res.sendStatus(401); // unauthorized
  // evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password)
  if(match) {
    const roles = Object.values(foundUser.roles).filter( role => role !== undefined );
    // create JWTs
    const accessToken = jwt.sign(
      { "UserInfo" : {
          "username": foundUser.username,
          "roles": roles
        }
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '10s' }
    );
    // the refreshToken is only there to verify that you can get a new accessToken
    const newRefreshToken = jwt.sign(
      { "username": foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );

    let newRefreshTokenArray = 
      !cookies?.jwt
        ? foundUser.refreshToken
        : foundUser.refreshToken.filter( rt => rt !== cookies.jwt)
    
    //we delete the old cookie on every auth
    if(cookies?.jwt) {
      /* 
      Scenario added here: 
          1) User logs in but never uses RT and does not logout 
          2) RT is stolen
          3) If 1 & 2, reuse detection is needed to clear all RTs when user logs in
      */
      const refreshToken = cookies.jwt;
      const foundToken = await User.findOne({ refreshToken }).exec();
      
      // Detected refresh token reuse!
      //NB: when a refreshToken is used, it is deleted in the DB
      if(!foundToken) {
        console.log('attempted refreshToken reuse at login');
        //clear all refreshToken
        newRefreshTokenArray = [];
      }
      
      res.clearCookie('jwt', { httpOnly: true, sameSite: "None", secure: true })
    }

    // Saving refreshToken with current user
    foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
    const result = await foundUser.save();
    console.log(result);
    // secure: true,
    //we store the newRefreshToken in a cookie httpOnly
    res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: "None", maxAge: 24*60*60*1000 }) //with httpOnly, the cookie is not available by the JS
    res.json({ accessToken })
  } else {
    res.sendStatus(401).json({'message': err.message})
  }
}

module.exports = { handleLogin };