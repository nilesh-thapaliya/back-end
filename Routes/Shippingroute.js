import User from "../modals/Register.js";
import express from "express";
import dotenv from "dotenv";
import nodemailer from 'nodemailer';
import jwt from "jsonwebtoken";
import mongoose from 'mongoose';
dotenv.config();
const app = express();


// get shipping info
app.get('/get-user-address', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token not provided' });
    }

    jwt.verify(token, 'secret-key', async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      const user = await User.findOne({ email: decoded.email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Send the user's cart items
      res.json({ shippingInfo: user.shippingInfo });
    });
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// update shipping info
app.post('/save-shipping-info', async (req, res) => {
  const { name, mobile, address, state, pincode, landmark, city } = req.body;

  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, error: 'Token not provided' });
    }

    jwt.verify(token, 'secret-key', async (err, decoded) => {
      if (err) {
        return res.status(401).json({ success: false, error: 'Invalid token' });
      }

      const user = await User.findOne({ email: decoded.email });
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }

      const newAddress = { name, mobile, address, state, pincode, landmark, city };


      user.shippingInfo.push(newAddress);


      const result = await user.save();


      console.log(result);

      res.json({
        success: true,
        message: 'Thanks Shipping information saved successfully',
        shippingInfo: user.shippingInfo
      });
    });
  } catch (error) {
    console.error('Error saving shipping information:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.post('/update-shipping-info', async (req, res) => {
  const { addressId, name, mobile, address, state, pincode, landmark, city } = req.body;
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, error: 'Token not provided' });
    }

    jwt.verify(token, 'secret-key', async (err, decoded) => {
      if (err) {
        return res.status(401).json({ success: false, error: 'Invalid token' });
      }

      const user = await User.findOne({ email: decoded.email });
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }


      const objectId = new mongoose.Types.ObjectId(addressId);
const shippingedit = user.shippingInfo.find(item => item._id.equals(objectId));
      if (shippingedit) {

        shippingedit.name = name,
          shippingedit.mobile = mobile,
          shippingedit.address = address,
          shippingedit.state = state,
          shippingedit.city = city,
          shippingedit.pincode = pincode,
          shippingedit.landmark = landmark
      }
        else {
        return res.json({ success: false, error: 'address not found' });
      }


      const result = await user.save();


      console.log(result);

      res.json({
        success: true,
        message: 'Thanks Shipping information update successfully',
        shippingInfo: user.shippingInfo
      });
    });
  } catch (error) {
    console.error('Error updating shipping information:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }



});



export default app;