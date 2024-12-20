const express = require('express');
const app = express();
const axios = require('axios');
require('dotenv').config();

app.use(express.json());

const supersecreat = process.env.WEBHOOK_SECRET || 'chelsea';

const authMiddleware = (req,res,next) => {
  const headers = req.headers;
  const secret = headers['x-secret'];
  if(secret !== supersecreat) {
   return res.status(401);
  }
  next();
}
const messages = [];
app.post('/git-info', authMiddleware, (req,res) => {
 const data = req.body;
 messages.push(data);
 res.status(200);
});


app.get('/', (req,res) => {
  return res.json(messages);
})

const PORT = process.env.PORT || 5601;
app.listen(PORT, () => {
  console.log(`Listening on PORT: ${PORT}`);
})