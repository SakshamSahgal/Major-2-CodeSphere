1. This Middleware is used to check if the user is a professor
2. It checks the `req.decoded.LoginType`
3. If the user is a professor it will call the next middleware
4. If the user is not a professor it will send a response with `status 401` which means `unauthorized`