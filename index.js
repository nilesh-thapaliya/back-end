//server.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import Cartroute from './Routes/Cartroute.js';
import Contactroute from './Routes/Contactroute.js';
import Newslaterroute from './Routes/Newslaterroute.js';
import Registerroute from './Routes/Registerroute.js';
import Shippingroute from './Routes/Shippingroute.js';
import Wishroute from './Routes/Wishroute.js';
import Apiroute from './Routes/Apiroute.js';
import Loginroute from './Routes/Loginroute.js';
import Orderroute from './Routes/Orderroute.js';
import Paymentroute from './Routes/Paymentroute.js';
import Accountroute from './Routes/Accountroute.js';
import Adminroute from './Routes/Admin.js';


  

const app = express();


app.use(express.json());
app.use(cors());


//routes
app.use('/',Contactroute)
app.use('/',Registerroute)
app.use('/',Newslaterroute)
app.use('/',Cartroute)
app.use('/',Wishroute)
app.use('/',Shippingroute)
app.use('/',Apiroute)
app.use('/',Loginroute)
app.use('/',Orderroute)
app.use('/',Paymentroute)
app.use('/',Accountroute)
app.use('/',Adminroute)






mongoose
.connect(
  "mongodb+srv://hundlanijay:hVFEqU8iumiSowXL@registerdata.pqv1sbi.mongodb.net/?retryWrites=true&w=majority"
)
.then(() => console.log("mongo connected"))
.catch((err) => console.log("mongo error", err));





app.listen(3034, () => {
console.log('Server connected');
});