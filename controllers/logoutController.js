const User = require('../model/User');

// This controller looks like authController, 
// except we erase the refreshToken from the user
// & the cookie

const handleLogout = async (req, res) => {
  // On client, also delete the accessToken

  const cookies = req.cookies;
  if(!cookies?.jwt){ //if we don't have cookie and jwt property in it
    return res.sendStatus(204) //No content to send
  }
  const refreshToken = cookies.jwt;

  //Is refreshToken in db?
  const foundUser = await User.findOne({ refreshToken }).exec();
  if(!foundUser) { 
    res.clearCookie('jwt', { httpOnly: true, sameSite: "None", secure: true })
    return res.sendStatus(204);
  } 
  // Delete refreshToken in db
  foundUser.refreshToken = '';
  const result = await foundUser.save();
  console.log(result);

  res.clearCookie('jwt', { httpOnly: true, sameSite: "None", secure: true })
  res.sendStatus(204);
}

module.exports = { handleLogout };