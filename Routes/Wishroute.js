import User from "../modals/Register.js";
import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();
const app = express();

// post for add to wish
app.post('/add-to-wish', async (req, res) => {
    const { categoryid, productid,productimg,productname,productprice} = req.body;
  
 
  
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
  
        const existingProduct = user.wish.find(
          item => item.categoryid === categoryid && item.productid === productid 
        );
        if (existingProduct) {
          return res.json({ success: false, error: 'Product  already in the wishlist' });
        }
  
        // Add the product to the user's wish
        user.wish.push({
          categoryid,
          productid,
          productimg,
          productname,
          productprice,
          
        });
  
        const result = await user.save();
  
        console.log(result);
  
        res.json({ success: true, message: 'Thanks Product added to wish', wishInfo: user.wish });
      });
    } catch (error) {
      console.error('Error adding to wish', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });
  
  
  // for cart data get
  
  app.get('/wish', async (req, res) => {
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
        res.json({ wishInfo: user.wish });
      });
    } catch (error) {
      console.error('Error fetching cart items:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
   
  // for remove product 
  app.post('/remove-from-wish', async (req, res) => {
    const { categoryid,productid } = req.body;
  
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'Token not provided' });
      }
  
      jwt.verify(token, 'secret-key', async (err, decoded) => {
        if (err) {
          return res.status(401).json({ message: 'Invalid token' });
        }
  
  
        const user = await User.findOneAndUpdate(
          { email: decoded.email },
          { $pull: { wish: { categoryid,productid} } },
          { new: true }
        );
  
     
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
  
      
  
        res.json({ success: true, message: 'Thanks Product removed from wishlist', wishInfo: user.wish });
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });


  
//move to cart from wishlist
app.post('/move2cart', async (req, res) => {
  const { categoryid,productid,size } = req.body;
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  try {
    jwt.verify(token, 'secret-key', async (err, decoded) => {
      if (err) {
        return res.status(401).json({ success: false, error: 'Invalid token' });
      }

      const user = await User.findOne({ email: decoded.email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const wishlistItem = user.wish.find(
        item => item.categoryid === categoryid && item.productid === productid 
      );

     
      const cartItem = user.cart.find(
        item => item.categoryid === categoryid && item.productid === productid && item.size === size
      );

      if (cartItem) {
        return res.json({ success: false, error: 'Product already in cart.' });
      }

      user.cart.push({
        productimg: wishlistItem.productimg,
        productname: wishlistItem.productname,
        productprice: wishlistItem.productprice,
        productid: wishlistItem.productid,
        categoryid: wishlistItem.categoryid,
        size
      });

     // Remove the item from the wishlist
     user.wish = user.wish.filter(
      item => !(item.categoryid === categoryid && item.productid === productid)
    );

      await user.save();

      res.json({
        success: true,
        message: 'Item move to cart ',
        cartInfo: user.cart,
        wishInfo: user.wish,

      });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

  export default app