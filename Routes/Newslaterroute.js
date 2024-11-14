import News from "../modals/Newsletter.js";
import User from '../modals/Register.js';
import express from "express";
import dotenv from "dotenv";
import nodemailer from 'nodemailer';
dotenv.config();
const app = express();


app.post('/newlater', async(req, res) =>{
    const {email} = req.body;
    
 
    
    try {
    
      const existingUserr = await News.findOne({ email });
      const existingRegister = await User.findOne({ email });
     
    
      if (existingUserr || existingRegister) {
        return res.json({ success: false, error: 'You are already a Subscriber!!' });
      }
    
    
    
    const result = await News.create({
        email,    
        });
                  
        console.log(result);
      
       const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      
       const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Thank You For Subscribing!',
        html: `
          <p>Thank you for Subscrbing with VHX View. We are excited to have you on board!</p>
          <p>Best regards,</p>
          <p>VHX View Team</p>
          <img src="https://i.ibb.co/qnVVcMk/digital-camera-photo-1080x675.jpg">
        `,
      
      
      };
      
      
      
      const info =  await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);
      res.json({ success: true, message: 'Thanks for subscribe' });
    } 
    
    
    
    
    catch (error) {
      console.error('Error during Subscribtion:', error);
    
      res.json({ success: false, error: 'Internal Server Error' });
    }
    
    
    });
  
  
    
   // for newslater data
  
    app.get('/newslatter-info', async (req, res) => {
  
      try {
        const emails = await News.find();
        
        res.json({ success: true, data:emails });
      } catch (error) {
        res.json({ success: false, error: 'Failed to retrieve Emails' });
      }
    });
    
    export default app