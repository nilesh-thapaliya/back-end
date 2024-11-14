import User from "../modals/Register.js";
import express from "express";
const app = express();

app.use(express.json());

app.get('/register-details', async (req, res) => {
    try {
        const registerDtails = await User.find();
        res.json({ success: true, AdminInfo:registerDtails });
      } catch (error) {
        res.json({ success: false, error: 'Failed to retrieve details' });
      }
  })



// order shipped 
app.post('/shipping-true', async (req, res) => {
    const { email,categoryid,productid,size } = req.body
  
    const user = await User.findOne({ email  })
  
    const item = user.order.find(
      item => item.categoryid === categoryid && item.productid === productid && item.size === size
    );

    item.shipped = true

    await user.save();

    res.json({ success: true, orderInfo: user.order });
  });


  //order deliverd
  app.post('/deliverd-true', async (req, res) => {
    const { email,categoryid,productid,size } = req.body
  
    const user = await User.findOne({ email  })
  
      

    const item = user.order.find(
      item => item.categoryid === categoryid && item.productid === productid && item.size === size
    );

    item.deliverd = true

   
    await user.save();

    res.json({ success: true, orderInfo: user.order });
  });



  
  export default app ;