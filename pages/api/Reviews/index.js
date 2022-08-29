import dbConnect from "../../../utils/mongo"
import Review from '../../../models/Review'
import User from '../../../models/User'
import jwt from 'jsonwebtoken';
import jwtVerify from "../../../utils/jwtVerfication"

const KEY = process.env.JWT_KEY;

export default async function handler(req, res) {
    // console.log(req)
    const { method } = req;
    dbConnect();

    if(method === 'GET'){
        const tok = req.headers.authorization.split(' ')[1];
        let isUserValid = jwtVerify(tok);
        if(!isUserValid){
            res.status(404).json("Invalid User")
        } 
        else{
            const reviews = await Review.find();
            console.log(reviews)
            res.status(200).json({message:"success",review:reviews})
        }
    }

    if(method === 'POST') {
        const {appReview,restaurantReview,rating,token,id} = req.body;
        // console.log(token);
        const tok = token.split(' ')[1];
        let isUserValid = jwtVerify(tok);
        if(!isUserValid){
            res.status(404).json("Invalid User")
        } 
        else{
            try{
            const user = await User.findById(id);
            console.log(user.username);
            const newUserReview = {
                appReview: appReview,
                restaurantReview: restaurantReview,
                rating : rating,
                username:user.username
            }
            // const options = {
            //     upsert: true,// upsert set to true to find an existing document if it exists or create a new one.
            //     new: true,// new is set to true to create a new document if it doesn’t exist.
            //     setDefaultsOnInsert: true
            // };
            let temp = await Review.find().lean();
            if(temp){
                temp = temp[0];
            }
            console.log(temp);
            const result = await Review.findByIdAndUpdate(temp._id, {newReview: [...temp.newReview,newUserReview]});
            res.status(201).json({"message":"success","valid":"User is verified",data:result})
            conole.log("nkjnkbkjbkm")

            }
            catch(err){
                res.status(500).json({message:"error",data:err})
            }
        }
    }
}