import User from "../modals/Register.js";
import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();
const app = express();

// post for add to cart
app.post('/add-to-cart', async (req, res) => {
    const { categoryid,productid,size,productimg,productname,productprice } = req.body;
  
    // console.log(categoryid,productid,size,productname,productprice,productimg)
    
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
  
        
        // Check if the product already exists in the cart with the same categoryid, productid, and size
        const existingProduct = user.cart.find(
          item => item.categoryid === categoryid && item.productid === productid && item.size === size
        );
  
        if (existingProduct) {
          return res.json({ success:false,error: 'Product already in cart with the same size' });
        }
  
       
        user.cart.push({
          categoryid,productid,size,productname,productprice,productimg
          
        });
  
        await user.save();
  
        console.log(user)
  
        res.json({ success: true, message: 'Thanks Product added to cart',cartInfo:user.cart});
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });

  app.get('/cart', async (req, res) => {
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
        res.json({ cartInfo: user.cart });
      });
    } catch (error) {
      console.error('Error fetching cart items:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  // for remove product 
app.post('/remove-from-cart', async (req, res) => {
    const { categoryid,productid,size } = req.body;
  
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
          { $pull: { cart: { categoryid,productid,size} } },
          { new: true }
        );
  
     
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
  
      
  
        res.json({ success: true, message: 'Thanks Product removed from cart', cartInfo: user.cart });
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });

  // for increase quantity
app.post('/increase-quantity', async (req, res) => {
    const { categoryid, productid,size } = req.body;
  
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'Token not provided' });
      }
  
      jwt.verify(token, 'secret-key', async (err, decoded) => {
        if (err) {
          return res.status(401).json({ message: 'Invalid token' });
        }
  
        // Find the user by email from the decoded token
        const user = await User.findOne({ email: decoded.email });
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
  
        const productInCart = user.cart.find(item => item.categoryid === categoryid && item.productid === productid && item.size === size);
        if (productInCart) {
          
          if (productInCart.quantity < 10) {
            productInCart.quantity = productInCart.quantity + 1;
          } else {
            return res.json({success:false, error: 'Maximum quantity 10' });
          }
        } else {
          return res.json({success:false, error: 'Product not found in cart' });
        }
  
        
        await user.save();
  
  
        res.json({ success: true, message: 'Quantity increased', cartInfo: user.cart });
      });
    } catch (error) {
      console.error('Error increasing quantity:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });
  
  
  
  // for decrease quantity
  app.post('/decrease-quantity', async (req, res) => {
    const { categoryid, productid,size } = req.body;
  
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'Token not provided' });
      }
  
      jwt.verify(token, 'secret-key', async (err, decoded) => {
        if (err) {
          return res.status(401).json({ message: 'Invalid token' });
        }
  
        // Find the user by email from the decoded token
        const user = await User.findOne({ email: decoded.email });
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
  
        const productInCart = user.cart.find(item => item.categoryid === categoryid && item.productid === productid && item.size===size)
        if (productInCart) {
          
          if (productInCart.quantity > 1) {
            productInCart.quantity = productInCart.quantity - 1;
          } else {
            return res.json({success:false, error: '1 Minimum quantity required' });
          }
        } else {
          return res.json({success:false, error: 'Product not found in cart' });
        }
  
        
        await user.save();
  
  
        res.json({ success: true, message: 'Quantity increased', cartInfo: user.cart });
      });
    } catch (error) {
      console.error('Error increasing quantity:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });

  export default app