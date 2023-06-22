# Node JS beginner

I made this tutorial to learn Node JS. 

It comes from Dave Gray's youtube channel: [Node JS for beginners](https://www.youtube.com/watch?v=f2EqECiTBL8)

This project contains: 
- a MVC structure 
- routes
- Auth system with JWT
- Middlewares
- a log system
- CORS
- MongooDB connexion & requests with Mongoose
- Thunderclient collections for request

The application consist in a mini employees collection deal by users. 

There are 3 types of users with different power: 
- Member
- Editor
- Admin

## API

To use this back-end as API : https://famous-simple-hippodraco.glitch.me/ (you need credentials to use it)

### Routes

* `/`
* `/register`
* `/auth` to log in
* `/refresh` to refresh access tokken
* `/logout`
* `/users` to get all users
* `/employees` to get all employees
* `/employees/:id` to get one employee by id

---

[All the ressources for this tutorial are there](https://github.com/gitdagray/node_js_resources)