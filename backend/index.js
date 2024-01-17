import express from "express";
import cors from "cors"
import { configDotenv } from "dotenv";
import passport, { Passport } from "passport";
import passportLocal from "passport-local"
import mongoose from "mongoose"
import MongoStore from "connect-mongo";
import session from "express-session";
import { AuthRouter } from "./routes/auth.js";
import { CustomerRouter } from "./routes/customer.js";
import { AdminRouter } from "./routes/admin.js";


const LocalStrategy = passportLocal.Strategy
const port = 3000
configDotenv()


mongoose.connect(process.env.MONGODB_URL,{dbName:"ecommerce"})
        .then(()=>console.log("Database connected")).catch((e)=>console.error(e))

const app = express()

app.use(express.urlencoded({extended:false}))
app.use(cors())

const storeOptions = { 
    mongoUrl : process.env.MONGODB_URL,
}

app.use(session({
    secret:process.env.SESSION_KEY,
    resave:false,
    saveUninitialized:true,
    store: MongoStore.create(storeOptions),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // Max age of the session cookie in milliseconds
        secure: false, // Set to true in production for HTTPS
        sameSite: 'strict', // Controls cookie sending behavior
    }, 
}))

app.use("/auth",AuthRouter)
app.use("/customer",CustomerRouter)
app.use("/admin",AdminRouter)

app.get('/dashboard', (req, res, next) => {
  res.send('Dashboard Login');
});

app.get('/admin', (req, res, next) => {
  res.send('Admin Login');
});

app.get("/",(req,res)=>{
    res.send("Working")
})

app.listen(port, () => console.log(`Working on ${port}`))


