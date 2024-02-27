
1. This middleware is used to validate the token in the cookies.
2. It takes the token from `req.cookies.token`
3. If the token is not present it will send a response with status 401
4. If the token is invalid it will send a response with status 401
5. If the token is valid it will call the next middleware , the decoded payload is stored in `req.decoded`