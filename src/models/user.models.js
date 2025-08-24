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
        
    },
    avatar:{
        type:String,//cloudinary
        required:true

    },
    coverimage:{
        type:String
    },
    password:{
        type:String,
        
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
if(this.isModified("password")){
    this.password=await bcrypt.hash(this.password,10);
    next();
}
else{
next();
}
});
userschema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password);
};
//now we have to deal with the refreshtoken and accesstoken
userschema.methods.generate_access_token=function(){
let accesstoken=jsonwebtoken.sign(
    {
        _id:this._id,
        username:this.username,
        email:this.email,
        fullname:this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
)
return accesstoken;
}
userschema.methods.generate_refesh_token=function(){
    let refreshtoken=jsonwebtoken.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
    return refreshtoken;
    }
 export const User=mongoose.model("User",userschema);
