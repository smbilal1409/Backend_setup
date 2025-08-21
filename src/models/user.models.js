import mongoose,{Schema} from "mongoose";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";
const userschema=new Schema({
    username:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
        unique:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
        unique:true
    },
    fullname:{
        type:String,
        required:true,
       index:true,
        trim:true,
        unique:true
    },
    avatar:{
        type:String,//cloudinary

    },
    coverimage:{
        type:String
    },
    password:{
        type:String,
        unique:true,
        required:true
    },
    watchhistory:[
        {
            type:Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    refreshtoken:{
        type:String
    }
        
},{
    timestamps:true
})
userschema.pre("save",async function(next){
if(this.modified(password)){
    this.password=bcrypt.hash(this.password,10);
    next();
}
else{
naxt();
}
});
userschema.method.ispasswordcorrect(async function(password){
    return await bcrypt.compare(password,this.password);
});
//now we have to deal with the refreshtoken and accesstoken
userschema.generate_access_token=function(){
let refreshtoken=jsonwebtoken.sign(
    {
        _id:this._id,
        username:this.username,
        email:this.email,
        fullname:this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiry:process.env.ACCESS_TOKEN_EXPIRY
    }
)
}
userschema.generate_refesh_token=function(){
    let refreshtoken=jsonwebtoken.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiry:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
    }
 export const User=mongoose.models("User",userschema);
