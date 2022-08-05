Deployed link/ Api Endpoint - https://kore-ai-assignment-api.herokuapp.com

Postman Api Documentation - https://go.postman.co/workspace/Ankur-Raj~7e97fa1c-0ca9-4e61-8501-8d311b2f78af/collection/13031474-3aa04979-e081-41d1-80df-2b13e2d68535?action=share&creator=13031474

Github Link - https://github.com/ancoreraj/Kore.AI

*** New Feature - Email Jwt Authentication ***

How to run the server locally
1. Extract the file
2. Add .env file at the root
3. Add MONGO_URI & JWT_SECRET variable in the .env file
4. Run `npm install`
5. Run `node app.js`

How to use the apis- 
1. Register the Admin with /auth/signup api
2. Login the Admin
3. All the orders routes are auth protected so add authorization : Token "jwt token" before making all the orders api requests
