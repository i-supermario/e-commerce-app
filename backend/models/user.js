import mongoose from 'mongoose'; 
import passportLocalMongoose from 'passport-local-mongoose'


const Schema = mongoose.Schema

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true
  },
})

UserSchema.plugin(passportLocalMongoose,{ usernameField: "email" })

export const UserModel = mongoose.model('user', UserSchema);




