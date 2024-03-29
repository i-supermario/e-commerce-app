import express from "express"
import { UserModel } from "../models/user.js"

const router = express.Router()

router.get("/get/:email",(req,res) => {
    const email = req.params.email
    UserModel.findOne({email: email, type: "ADMIN"})
    .then((user)=>{
        res.status(200).send({"user": user})
    })
    .catch(e => res.status(400).send({e}))
})

router.get("/dashboard" ,(req,res) => {
    res.send("Admin dashboard")
})

export const AdminRouter = router