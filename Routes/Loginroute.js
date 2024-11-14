import User from "../modals/Register.js";
import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
dotenv.config();
const app = express();


// login post
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
        const user = await User.findOne({ email });
  
        if (!user) {
            return res.json({ success: false, error: 'Invalid username and password' });
        }
  
        const passwordMatch = await bcrypt.compare(password, user.password);
  
        if (!passwordMatch) {
            return res.json({ success: false, error: 'Invalid username and password' });
        }
  
        const token = jwt.sign({ email }, 'secret-key', { expiresIn: '24h' });
  
        const accountInfo = {
            fname: user.fname,
            lname: user.lname,
            email: user.email,
            mobile: user.mobile,
        };
  
        res.json({
            success: true,
            message: 'Thanks for logging in!',
            data: token,
            cartInfo: user.cart,
            wishInfo: user.wish,
            shippingInfo: user.shippingInfo,
            accountInfo: accountInfo,
            orderInfo: user.order
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });
  
  
  

  export default app