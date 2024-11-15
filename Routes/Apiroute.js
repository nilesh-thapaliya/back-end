import express from "express";
import path from "path";
import fs from 'fs';

const app = express();

// use in ES6 version 
import{ fileURLToPath } from'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 
  
app.use(express.static(path.join(__dirname, '../assets')));
// get data from api

app.get('/api', (req, res) => {
    const filePath = path.join(__dirname, '../data.json');
  
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.json({ success: false, error: 'Internal Server Error' });
        }
  
        try {
            const jsonData = JSON.parse(data);
  
            const updatedData = jsonData.map(item => {
                if (item.category_img) {
                    item.category_img = `${req.protocol}://${req.get('host')}${item.category_img}`;
                }
  
                // Update product_container
                item.product_container = item.product_container.map(product => ({
                    ...product,
                    product_img: `${req.protocol}://${req.get('host')}${product.product_img}`,
                    side_img: product.side_img.map(sideImg => ({
                        ...sideImg,
                        img: `${req.protocol}://${req.get('host')}${sideImg.img}`,
                    })),
                }));
  
                return item;
            });
  
            res.json({ success: true, data: updatedData });
        } catch (error) {
          console.error('Error fetching data:', error);
            res.json({ success: false, error: 'Internal Server Error' });
        }
    });
  });

  app.get('/cities', async (req, res) => {
    const filePath = path.join(__dirname, '../city.json');

    try {
   
        const data = await fsPromises.readFile(filePath, 'utf8');
        
        const cities = JSON.parse(data);
        res.json(cities);

    } catch (error) {
        console.error('Error reading or parsing cities data:', error);
        res.status(500).json({ error: 'Could not read or parse the cities data' });
    }
});


  export default app