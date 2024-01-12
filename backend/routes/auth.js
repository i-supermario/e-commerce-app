import express from "express";
import { configDotenv } from "dotenv";
import passport from "passport";
import passportLocal from "passport-local"
import { UserModel } from "../models/user.js";

const LocalStrategy = passportLocal.Strategy
configDotenv()
const router = express.Router()

const strategy = new LocalStrategy(UserModel.authenticate())

passport.use(strategy)
passport.serializeUser(UserModel.serializeUser())
passport.deserializeUser(UserModel.deserializeUser())

router.use(passport.initialize())
router.use(passport.session())

router.get("/",(req,res)=> res.send("Working Auth"))

router.post("/register", (req,res) => {
    UserModel.register(
        new UserModel({ 
          email: req.body.email,
          name: req.body.name,
          type: req.body.type
        }), req.body.password, function (err, msg) {
          if (err) {
            res.send(err);
          } else {
            res.send({ message: "Successful" });
          }
        }
      )
})

// username field is required in body for passport authentication 
router.post('/login', passport.authenticate('local', { 
    failureRedirect: '/login-failure', 
  }), 
  (req, res, next) => {

    const userType = req.body.type
    if(userType=="ADMIN") res.redirect("/admin")
    else res.redirect("/dashboard")
  });
  
router.get('/login-failure', (req, res, next) => {
    console.log(req.session);
    res.send('Login Attempt Failed.');
});

const isAuthenticated = (req,res,next) => {
    if(req.isAuthenticated()){
        return next()
    }
}

router.get("/protected", isAuthenticated, (req, res) => res.send({"message": "dashboard"}))

export const AuthRouter = router