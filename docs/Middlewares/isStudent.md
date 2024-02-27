1. This Middleware is used to check if the user is a student
2. It checks the `req.decoded.LoginType`
3. If the user is a student it will call the next middleware
4. If the user is not a student it will send a response with `status 401` which means `unauthorized`