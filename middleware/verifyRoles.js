const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if(!req?.roles) return res.sendStatus(401); //if not req with roles
    const rolesArray = [...allowedRoles];
    console.log(rolesArray);
    console.log(req.roles);
    // includes return a boolean, so here an array of booleans
    // .find() : we need to find if a role has access right, so if it's "true"
    const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true);
    if(!result) return res.sendStatus(401);
    next(); 
  }
}

module.exports = verifyRoles