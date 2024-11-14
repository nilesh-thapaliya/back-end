import User from "../modals/Register.js";
import News from "../modals/Newsletter.js"
import express from "express";
import dotenv from "dotenv";
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
dotenv.config();
const app = express();


app.post('/register', async(req, res) => {
    const { fname,lname, email, mobile, password } = req.body;
    
    console.log(`Name: ${fname}, Email: ${email}, Mobile: ${mobile}, Password: ${password}`);
    
    try {
    
      // Check if the user with the given email already exists
      const existingUser = await User.findOne({ email });
      
    
      if (existingUser) {
        return res.json({ success: false, error: 'Email already registered, please login!' });
      }
    
    
      const hashedPassword = await bcrypt.hash(password, 10);
    
      // add data
    const result = await User.create({
        fname,
        lname,
        email,
        mobile,
        password:hashedPassword,
                  
        });
                  
        console.log(result);
    
        // for newslatter
    
    
        const result1 = await News.create({  
          email,        
          });
                    
          console.log(result1);
      
       // Create a Nodemailer transporter
       const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      
      
      
      
       // Define email options
       const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Welcome to VHX View',
        html: `
          <p>Hello ${fname}</p>
          <p>Thank you for registering with VHX View. We are excited to have you on board!</p>
          <p>Best regards,</p>
          <p>VHX View Team</p>
          <img src="https://i.ibb.co/qnVVcMk/digital-camera-photo-1080x675.jpg">
        `,
      };
      

      const info =  await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);
      res.json({ success: true, message: ' Thanks Registration successful' });
    } 
    
    

    catch (error) {
      console.error('Error during registration:', error);
    
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    
    }
         
    });

    export default app