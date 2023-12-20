const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { globalErrorHandler } = require('./utilities/helperFunctions');
const apiRoutes = require('./Routes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

apiRoutes(app);

app.use('/test',(req,res)=>{
   return res.send(`Express Server API's Running and able to reach `)
});

app.use(globalErrorHandler);
 

app.listen(process.env.NODE_PORT,()=>console.log(`Express is running in port ${process.env.NODE_PORT}`))
