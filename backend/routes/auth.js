import express from "express";
import { configDotenv } from "dotenv";
import passport from "passport";
import passportLocal from "passport-local"
import { UserModel } from "../models/user.js";
import passportGoogleStrategy from "passport-google-oauth2"

const LocalStrategy = passportLocal.Strategy
configDotenv()
const router = express.Router()

router.get("/",(req,res)=> res.send("Working Auth"))

// LOCAL STRATTEGY

const strategy = new LocalStrategy(UserModel.authenticate())

passport.use(strategy)
passport.serializeUser(UserModel.serializeUser())
passport.deserializeUser(UserModel.deserializeUser())

router.use(passport.initialize())
router.use(passport.session())

router.post("/register", (req,res) => {
    UserModel.register(
        new UserModel({ 
          email: req.body.email,
          name: req.body.name,
          type: req.body.type,
          authType: "local"
        }), req.body.password, function (err, msg) {
          if (err) {
            res.send(err);
          } else {
            res.send({ message: "Successful" });
          }
        }
      )
})


router.post('/login', 
(req,res,next) => {
  console.log("login")
  console.log(req)
  if(req.body.authType=="local") next()
  else res.redirect("/auth/google/login")
},
passport.authenticate('local', { 
  failureRedirect: '/login-failure', 
}), 
(req, res, next) => {
    console.log("logged in")
    const userType = req.body.type
    if(userType=="ADMIN"){
      res.redirect("/admin/dashboard")
    }
    else {
      res.redirect("/customer/dashboard")
    }
});

// GOOGLE OAUTH STRATEGY

const googleAuthStrategy = passportGoogleStrategy.Strategy

passport.use(new googleAuthStrategy({
  clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
  clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/google/redirect',
  scope: [ 'email','profile' ],
  passReqToCallback   : true
}, 
(request, accessToken, refreshToken, profile, done) => {
  UserModel.findOne({ email: profile.emails?.[0].value })
  .then((user) => {
    if(!user){
      UserModel.create({
        name: profile.displayName,
        email: profile.emails?.[0].value,
        type: "CUSTOMER",
        authType: "google"
      })
      .then((newUser) => done(null, newUser))
    }
    else {
      return done(null,user)
    }
  })
}
))

router.get("/google/login", passport.authenticate("google"))

router.get('/google/redirect',
  passport.authenticate('google', 
  { 
    failureRedirect: '/auth/login-failure',
    successRedirect: '/dashboard',
    failureMessage: true 
  }
))

// OTHER
  
router.get('/login-failure', (req, res, next) => {
    res.send('Login Attempt Failed.');
});

export const isAuthenticated = (req,res,next) => {
  if(req.isAuthenticated()){
      return next()
  }
}


export const AuthRouter = router