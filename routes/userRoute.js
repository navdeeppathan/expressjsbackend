import express from 'express'
import UserController from '../controllers/userController.js'
import checkUserAuth from '../middlewares/auth-Middleware.js'
const router =express.Router()

//Route level MiddleWare -to protect Route (use token to access)
router.use('/changepassword',checkUserAuth)
router.use('/loggeduser',checkUserAuth)



//public route
router.post('/register',UserController.userRegistration)
router.post('/login',UserController.userLogin)
router.post('/send-reset-password-email',UserController.sendUserPasswordResetEmail)
router.post('/reset-password/:id/:token',UserController.UserPasswordReset)




//private Route
router.post('/changepassword',UserController.changeUserPassword)
router.get('/loggeduser',UserController.loggedUser)


export default router;