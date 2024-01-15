import express from "express"
import { UserModel } from "../models/user.js"
import { isAuthenticated } from "../middleware/utils.js"

const router = express.Router()

router.get("/get/:email",(req,res) => {
    const email = req.params.email
    UserModel.findOne({email: email, type: "CUSTOMER"})
    .then((user)=>{
        res.status(200).send({"user": user})
    })
    .catch(e => res.status(400).send({e}))
})

router.get("/dashboard", isAuthenticated, (req,res) => {
    console.log("customer dashboard")
    res.send("Customer dashboard")
})

export const CustomerRouter = router