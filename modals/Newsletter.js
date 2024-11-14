import mongoose from "mongoose";

const NewsSchema = new mongoose.Schema({
 
    email:{
      type: String,
      requre: true,
    },
   
  
  });

  const News = mongoose.model("newlater", NewsSchema);
 
  export default News