
1. This route is used to get the profile of the user
2. It will send the profile of the user based on `req.decoded.LoginType`
3. If the user is a student it will send the profile of the student containing `Batch`, `Name`, `Username`, `Year` and `Institution`
4. If the user is a professor it will send the profile of the professor, containing `Name`, `Username` and `Institution`