const data = {
  employees: require('../model/employees.json'),
  setEmployees: function(data) { this.employees=data }
};

const getAllEmployees = (req, res) => {
  res.json(data.employees)
}

const createEmployee = (req, res) => {
  const newEmployee = {
    id: data.employees[data.employees.length - 1].id + 1 || 1,
    firstname: req.body.firstname,
    lastname: req.body.lastname
  }

  if(!newEmployee.firstname || !newEmployee.lastname) {
    return res.status(400).json({ 'message': 'First & lastname are required' })
  }

  data.setEmployees([...data.employees, newEmployee])
  res.status(201).json(data.employees)
}

const updateEmployee = (req, res) => {
  const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));

  if(!employee) {
    return res.status(400).json({"message": `Employee ID ${req.body.id} not found.`})
  }
}

const deleteEmployee = (req, res) => {
  res.json({
    "id": req.body.id
  })
}

const getEmployee = (req, res) => {
  res.json({
    "id": req.params.id
  })
}

module.exports = {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee
}