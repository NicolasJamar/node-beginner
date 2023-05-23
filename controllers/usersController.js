const User = require('../model/User');

const getAllUsers = async(req, res) => {
  const allUsers = await User.find({});
  if(!allUsers) res.status(204).json({'message': 'there is no user yet'})
  res.json(allUsers)
}

const createUser = async(req, res) => {
  if(!req?.body?.username || req?.body?.password) {
    return res.status(400).json({'message': 'username or password are required'})
  }

  try {
    const result = await User.create({
      username: req.body.username,
      password: req.body.password
    })
    res.status(201).json(result)
  } catch(err) {
    console.error(err);
  }
}

const deleteUser = async(req, res) => {
  if(!req?.body?.id) res.status(400).json({'message': 'id parameter is required'})

  const user = await User.findOne({ _id: req.body.id }).exec();
  if(!user) res.status(204).json({"message": `Employee ID ${req.body.id} not matched.`})

  const result = await user.deleteOne({ _id: req.body.id})
  res.json(result)

}

const getUser = async(req, res) => {
  if(!req?.params?.id) res.status(400).json({'message': 'id parameter is required'})

  const user = await User.findOne({ _id: req.params.id }).exec();
  if(!user) res.status(400).json({"message": `Employee ID ${req.params.id} not found.`})

  res.json(user)
}


module.exports = {
  getAllUsers,
  createUser,
  deleteUser,
  getUser
}