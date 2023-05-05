const usersDB = {
  users: require('../model/users.json'),
  setUsers: function(data) { this.users = data }
}

const fsPromises = require('fs').promises;
const path = require('path');

// This controller looks like authController, 
// except we erase the refreshToken from the user
// & the cookie

const handleLogout = async (req, res) => {
  // On client, also delete the accessToken

  const cookies = req.cookies;
  if(!cookies?.jwt){ //if we don't have cookie and jwt property in it
    res.sendStatus(204) //No content to send
  }
  const refreshToken = cookies.jwt;

  //Is refreshToken in db?
  const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken)
  if(!foundUser) { 
    res.clearCookie('jwt', {httpOnly: true})
    return res.sendStatus(204);
  } 
  // Delete refreshToken in db
  const otherUsers = usersDB.users.filter( person => {
    person.refreshToken !== foundUser.refreshToken
  });
  const currentUser = { ...foundUser, refreshToken: '' }; //we erase refreshToken
  usersDB.setUsers([...otherUsers, currentUser]);
  await fsPromises.writeFile(
    path.join(__dirname, '..', 'model', 'users.json'),
    JSON.stringify(usersDB.users)
  )

  res.clearCookie('jwt', {httpOnly: true}) //secure: true - only serves on https 
  res.sendStatus(204);
}

module.exports = { handleLogout };