import mongoose from "mongoose";

const registerSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: [
    {
      categoryid: {
        type: Number,
        required: true
      },
      productid: {
        type: Number,
        required: true
      },
      size: {
        type: String,
        required: true
      },
      productimg: {
        type: String,
        required: true
      },
      productname: {
        type: String,
        required: true
      },
      productprice: {
        type: Number,
        required: true
      },
      quantity: {
        type: Number,
        default: 1
      },

    },
  ],

  wish: [
    {

      categoryid: {
        type: Number,
        // required:true,
      },
      productid:
      {
        type: Number,
        // required:true,
      },
      productimg:
      {
        type: String,
        // required:true
      },
      productname:
      {
        type: String,
        // required:true
      },
      productprice:
      {
        type: Number,
        // required:true
      },



    },
  ],

  shippingInfo: [
    {
      name: {
        type: String,
      },
      mobile: {
        type: String,
      },
      address: {
        type: String,
      },
      state: {
        type: String,
      },
      pincode: {
        type: String,
      },
      landmark: {
        type: String,
      },
      city: {
        type: String,
      },
    },
  ],

  order: [

    {

      orderDate: {
        type: String
      },

      categoryid: {
        type: Number,
        required: true,
      },
      productid:
      {
        type: Number,
        required: true,
      },
      productimg:
      {
        type: String,
      },
      productname:
      {
        type: String,
      },
      productprice:
      {
        type: String,
      },
      size:
      {
        type: String,
      },
      quantity:
      {
        type: Number,
        default: 1
      },
      deliveryaddressid: 
      {
        type: String,
        require:true,
      },
      confirm: {
        type: Boolean,
        default: true,
        require: true
      },
      shipped: {
        type: Boolean,
        require: true,
        default: false
      },
      deliverd: {
        type: Boolean,
        require: true,
        default: false
      },
    },
  ],
});

const User = mongoose.model("newuser", registerSchema);

export default User