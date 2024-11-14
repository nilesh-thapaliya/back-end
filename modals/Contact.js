import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    
    email: {
      type: String,
  },
    orderRelated: [{
        orderID: {
            type: String
        },
        message: {
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    returnRelated: [{
  
        reason: {
            type: String,
           
        },
        message: {
            type: String,
           
        },
        file: {
            type: String,
           
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    otherRelated:[ {
  
      name: {
        type: String,
      
    },
        message: {
            type: String,
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
});



  const Contact = mongoose.model('contactus',contactSchema)

  export default Contact