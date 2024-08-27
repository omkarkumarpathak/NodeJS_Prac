//Auth
const passport=require('passport')
const LocalStrategy=require('passport-local').Strategy;

passport.use(new LocalStrategy(async(username,password,done)=>{
    try {
        const user=await User.findOne({username:username});
        if(!user){
            return done(null,false,{message:"Incorrect Username"});
        }
        const isPassMatch=user.password===password?true:false;
        if(!isPassMatch){
            return done(null,false,{message:'Incorrect Password'});
        }
        return done(null,user);
    } catch (error) {
        res.status(500).json({error:"internal Server error"});
    }
}))


module.exports=passport;
