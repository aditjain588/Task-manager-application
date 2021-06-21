# Task-manager-application
**Tools**: Node.js, REST API's using Express.js, MongoDB, Mongoose, POSTMAN API

Using task manager applicaiton, an user can add to-do tasks with description and status of completion </br>
**Features**
- Authentication: User can create account, he can log in using email and password. Password is encrypted and then stored to database. A user won't have access to another user's account.
- Tasks association: Task created by one user are only associated to his account and won't be accessible by other users. Means one user cannot delete/update the tasks of another user.
- User can upload a profile pic and can delete an existing profile pic. </br>
**
Setting up MongoDB database**
- To start a new database instance, run the following command
{mongoDB file path} --dbpath={data storage path} mongodb/bin/mongod --dbpath=/Users/..../mongodb-data

**TO DO**
- Currently this project only has a backend, where REST API's are tested using POSTMAN. In the future, a frontend will be added which will make the application easy to use.

This project was build as part of an online course: https://www.udemy.com/course/the-complete-nodejs-developer-course-2/
