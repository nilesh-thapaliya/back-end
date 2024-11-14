import Contact from "../modals/Contact.js";
import express from "express";
import dotenv from "dotenv";
import nodemailer from 'nodemailer';
dotenv.config();
import multer from 'multer';
import path from 'path';
const app = express();
import fs from 'fs';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
app.use('/uploads', express.static('uploads'));    //for get and view files




//order related form submit
app.post('/submit-orderform', async (req, res) => {
  const { email, orderID, message } = req.body;

  try {
    
    const existing = await Contact.findOne({ email });

    if (existing) {
      const existingmsg = existing.orderRelated.find(
        item => item.orderID === orderID 
      );

      if (existingmsg) {
        return res.json({ success: true, message: 'You have already sent a message for this order.' });
      }

      existing.orderRelated.push({
        orderID,
        message,
 
      });

      await existing.save();

      return res.json({ success: true, message: 'Your message has been successfully sent!' });
    }

    // If user does not exist, create a new document and save it
    const neworderForm = new Contact({
      email,
      orderRelated: [
        {
          orderID,
          message,
        }
      ]
    });
    
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
            subject: `Order ${orderID} - Update `,
            html: `
              <p>Hello ${email}</p>
              <p>Thank you for contacting us regarding your order, ${orderID}. We appreciate you bringing this matter to our attention.</p>
              <p>We understand that you are experiencing issue. We apologize for any inconvenience this may have caused.</p>
             <p>We will keep you updated on the progress of your order and provide you with a resolution as soon as possible.</p>
             <p>Thank you for your patience and understanding.</p>
              <p>VHX View Team</p>
            `,
          };
    
            const info =  await transporter.sendMail(mailOptions);
    
    
    await neworderForm.save();
    
    res.json({ success: true, message: 'Thanks Your message has been sent!' });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: 'Failed to submit order-related form' });
  }
});



//   Other Queries   
app.post('/submit-other', async (req, res) => {
  const { email, name, message } = req.body;

  try {
    
    const existing = await Contact.findOne({ email });

   
    if (existing) {
      const existingmsg = existing.otherRelated.find(
        item => item.name === name
      );

      if (existingmsg) {
        return res.json({ success: true, message: 'You have already sent a message for this order.' });
      }

      existing.otherRelated.push({
        name,
        message,
 
      });

      await existing.save();

      return res.json({ success: true, message: 'Your message has been successfully sent!' });
    }

    // If user does not exist, create a new document and save it
    const newOtherForm = new Contact({
      email,
      otherRelated: [
        {
          name,
          message,
        }
      ]
    });
    
    
    
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
              subject: `Order Update `,
              html: `
                <p>Hello ${name}</p>
                <p>Thank you for contacting us regarding your order. We appreciate you bringing this matter to our attention.</p>
                  <p>We understand that you are experiencing issue. We apologize for any inconvenience this may have caused.</p>
             <p>We will keep you updated on the progress of your order and provide you with a resolution as soon as possible.</p>
             <p>Thank you for your patience and understanding.</p>
              <p>VHX View Team</p>
              `,
            };
      
              const info =  await transporter.sendMail(mailOptions);
      
      
      await newOtherForm.save();

    res.json({ success: true, message: 'Thanks Your message has been sent!' });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: 'Failed to submit order-related form' });
  }
});


//return related  
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });


const uploadDir = './uploads/';   //if diractory not available than create
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}


app.post('/submit-return', upload.single('file'), async (req, res) => {
  const { email, reason, message } = req.body;


  try {
    
    const existing = await Contact.findOne({ email });

    if (existing) {
      const existingmsg = existing.returnRelated.find(
        item => item.reason === reason
      );

      if (existingmsg) {
        return res.json({ success: true, message: 'You have already sent a message for return/replace.' });
      }

      existing.returnRelated.push({
        reason,
        message,
        file: '/uploads/' + req.file.filename
 
      });

      await existing.save();

      return res.json({ success: true, message: 'Your message has been successfully sent!' });
    }

    // If user does not exist, create a new document and save it
    const newreturnForm = new Contact({
      email,
      returnRelated: [
        {
          reason,
          message,
          file: '/uploads/' + req.file.filename
        }
      ]
    });
    
    
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
            subject: `${reason} Update `,
              html: `
                <p>Hello ${email}</p>
                <p>Thank you for contacting us regarding your order ${reason} issue. We appreciate you bringing this matter to our attention.</p>
                  <p>We understand that you are experiencing ${reason} issue. We apologize for any inconvenience this may have caused.</p>
             <p>We will keep you updated on the progress of your order and provide you with a resolution as soon as possible.</p>
             <p>Thank you for your patience and understanding.</p>
              <p>VHX View Team</p>
            `,
          };

            const info =  await transporter.sendMail(mailOptions);
    
    
    await newreturnForm.save();

    res.json({ success: true, message: 'Thanks Your message has been sent!' });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: 'Failed to submit order-related form' });
  }
});






app.get('/contact-info', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json({ success: true, data: contacts });
  } catch (error) {
    res.json({ success: false, error: 'Failed to retrieve contacts' });
  }
});

export default app