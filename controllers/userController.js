import UserModel from "../models/User.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import transporter from "../config/EmailConfig.js";

class UserController{
    static userRegistration=async(req,res)=>{
        const {name,email,password,password_confirmation,tc}=req.body
        const user = await UserModel.findOne({email:email})

        if(user){
            res.send({'status':'failed' , 'message':'Email Already Exists..'})
        }else{
            if(name && email && password && password_confirmation && tc){
                if(password === password_confirmation){
                    try {
                        const salt = await bcrypt.genSalt(10)
                        const hashPassword =await bcrypt.hash(password,salt)
                        const doc=new UserModel({
                            name:name,
                            email:email,
                            password:hashPassword,
                            tc:tc
                        })
                        await doc.save()
                        //saved data
                        const saved_user=await UserModel.findOne({email:email})
                        //Generate Token
                        const token = jwt.sign({userID:saved_user._id},process.env.JWT_SECRET_KEY,{expiresIn:'5d'})
            res.send({'status':'success' , 'message':' registration success','token':token})

                    } catch (error) {
                        console.log(error)
            res.send({'status':'failed' , 'message':'unable to register'})

                    }

                }else{
            res.send({'status':'failed' , 'message':'password and confirm password does not match..'})

                }
                
            }else{
            res.send({'status':'failed' , 'message':' All fields are required ...'})

            }
        }
    }

    //login process
    static userLogin=async(req,res)=>{
        try {
            const {email,password}=req.body
        if(email && password){
        const user = await UserModel.findOne({email:email})
        if(user!==null){
          const isMatch = await bcrypt.compare(password,user.password)
          if(user.email === email && isMatch){

            //Generate JWT token
            const token= jwt.sign({userID:user._id},process.env.JWT_SECRET_KEY,{expiresIn:'5d'})
            res.send({'status':'success' , 'message':' Login successfully','token':token})

          }else{
            res.send({'status':'failed' , 'message':'email or password does not match'})

          }
        }else{
            res.send({'status':'failed' , 'message':'You are not a register user'})

        }
          
        }else{
            res.send({'status':'failed' , 'message':' All fields are required ...'})
            
        }
        } catch (error) {
            console.log(error)
            res.send({'status':'failed' , 'message':'unable to Login'})

        }
    }

    //change password
    static changeUserPassword =async(req,res)=>{
        const {password , password_confirmation}=req.body
        if(password && password_confirmation){
            if(password !==password_confirmation){
            res.send({'status':'failed' , 'message':'New password and New confirm password does not match..'})
                
            }else{
                //hash password 
                const salt = await bcrypt.genSalt(10)
                const newhashPassword=await bcrypt.hash(password,salt)
                // console.log(req.user)
                await UserModel.findByIdAndUpdate(req.user._id,{$set:{password:newhashPassword}})
            res.send({'status':'success' , 'message':' change password successfull....'})

            }

        }else{
            res.send({'status':'failed' , 'message':' All fields are required ...'})

        }
    }

    //logged user 
    static loggedUser=async(req,res)=>{
        res.send({"user":req.user})
    }

    //email 
    static sendUserPasswordResetEmail=async(req,res)=>{
        const {email}=req.body
        if(email){
            const user =await UserModel.findOne({email:email})
            if(user){
                const secret = user._id + process.env.JWT_SECRET_KEY
                const token =jwt.sign({userID:user._id},secret,{expiresIn:'15m'})
                const link = `http://127.0.0.1:3000/api/user/reset/${user._id}/${token}`
                console.log(link)

                //send Email
                let info= await transporter.sendMail({
                    from:process.env.EMAIL_FROM,
                    to:user.email,
                    subject:'Ecom-web -Password Reset link',
                    html:`<a href=${link}> Click here</a> to Reset Your Password`
                    

                })
                res.send({'status':'success','message':'Password Reset Email sent...Please check Your Email' ,'info':info})

            }else{
                res.send({'status':'failed' , 'message':'email does not exists...'})

            }
        }else{
            res.send({'status':'failed' , 'message':'please provide email...'})

        }
    }

    //reset password
    static UserPasswordReset =async(req,res)=>{
        const {password,password_confirmation}=req.body
        const {id,token}=req.params
        const user =await UserModel.findById(id)
        const new_secret=user._id + process.env.JWT_SECRET_KEY
        try {
            jwt.verify(token,new_secret)
            if(password && password_confirmation){
                if(password !==password_confirmation){
                    res.send({'status':'failed' , 'message':'New password and New confirm password does not match..'})

                }else{
                    //hash password
                    const salt = await bcrypt.genSalt(10)
                    const newhashPassword=await bcrypt.hash(password,salt)
                    // console.log(req.user)
                    await UserModel.findByIdAndUpdate(user._id,{$set:{password:newhashPassword}})
                res.send({'status':'success' , 'message':' password  reset successfully....'}) 
                }
            }else{
                res.send({'status':'failed' , 'message':' All fields are required ...'})
            }
        } catch (error) {
           console.log(error)
           res.send({'status':'failed' , 'message':'Invalid token...'})

        }
    }

}
export default UserController;