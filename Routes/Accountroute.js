import User from "../modals/Register.js";
import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import cors from "cors";
dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// get account data
app.get('/account-details', async (req, res) => {
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

      const accountInfo = {
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        mobile: user.mobile,

      };

      res.json({ accountInfo: accountInfo });
    });
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// ACCOUNT INFORMATION UPDATE 

app.post('/update-ac-data', async (req, res) => {
  const { fname, lname, email, mobile } = req.body;


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

      // Check if the submitted email is different from the logged-in user's email
      if (email !== decoded.email) {
        // Check if the new email already exists in the database
        const exist = await User.findOne({ email });
        if (exist) {
          return res.json({ success: false, error: 'Email already registered' });
        }
      }



      user.fname = fname;
      user.lname = lname;
      user.email = email;
      user.mobile = mobile;

      await user.save();

      const newtoken = jwt.sign({ email: email }, 'secret-key', { expiresIn: '24h' });


      const accountInfo = {

        fname: user.fname,
        lname: user.lname,
        email: user.email,
        mobile: user.mobile,

      };

      res.json({ success: true, message: 'Thanks Your Information has Been Updated', accountInfo: accountInfo, tokendata: newtoken, });
      
      
      
    });
  } catch (error) {
    console.error('Error fetching user address:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }



});

export default app