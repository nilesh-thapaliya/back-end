import User from "../modals/Register.js";
import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer';
dotenv.config();
const app = express();

// add to order
app.post('/add-to-order', async (req, res) => {

  const { orderDate, addressId } = req.body;
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token not provided' });
    }

    jwt.verify(token, 'secret-key', async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      const user = await User.findOne({ email: decoded.email });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }



      // Add each cart item to the order with the current date
      user.cart.forEach(item => {
        user.order.push({
          orderDate,
          categoryid: item.categoryid,
          productid: item.productid,
          productimg: item.productimg,
          productname: item.productname,
          productprice: item.productprice,
          size: item.size,
          quantity: item.quantity,
          deliveryaddressid: addressId

        });
      });

      // Clear user cart after adding to order
      user.cart = [];

      await user.save();

      res.json({
        success: true,
        message: 'Thanks! Your Order has Been Confirmed',
        orderInfo: user.order,
        cartInfo: user.cart
      });
    });
  } catch (error) {
    console.error('Error adding to order:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


//reorder handler
app.post('/add-to-reorder', async (req, res) => {

  const { orderDate,
    categoryid,
    productid,
    productimg,
    productname,
    productprice,
    size,
    quantity,
    deliveryaddressid } = req.body;
    console.log ( orderDate,
      categoryid,
      productid,
      productimg,
      productname,
      productprice,
      size,
      quantity,
      deliveryaddressid)
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token not provided' });
    }

    jwt.verify(token, 'secret-key', async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      const user = await User.findOne({ email: decoded.email });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      user.order.push({
        orderDate,
        categoryid,
        productid,
        productimg,
        productname,
        productprice,
        size,
        quantity,
        deliveryaddressid,
      });

      await user.save();

      res.json({
        success: true,
        message: 'Thanks! Your Order has Been Confirmed',
        orderInfo: user.order,
      });
    });
  } catch (error) {
    console.error('Error adding to order:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


// get order
app.get('/order', async (req, res) => {
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

      res.json({ orderInfo: user.order });

    });
  } catch (error) {
    console.error('Error fetching order items:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default app 