const express = require('express');
const app = express();
const axios = require('axios');

app.use(express.json());
const webhooks = {
  COMMIT: [],
  PUSH: [],
  MERGE: []
}

// http://localhost:5601/git-info , supersecretcd 

app.post('/api/webhooks', (req,res) => {
   const { eventTypes, payloadUrl, secret } = req.body;
   console.log(req.body);
   eventTypes.forEach(element => {
    webhooks[element].push({payloadUrl,secret,eventTypes});
   });
   return res.status(201);
});

app.post('/api/event-emulate', (req,res) => {
  const { type, data } = req.body;
  

  // There can be multiple webhooks registered for a single event, so we dont need to trigger event synchronously. 
  setTimeout(async () => {
    const webhookslist = webhooks[type];
    webhookslist.array.forEach(async element => {
      const {payloadUrl , secret} = element;
     await axios.post(payloadUrl,data, {
        headers: {
          'x-secret': secret
        }
      });
    });
  },0);
  return res.status(201);
});

const PORT = process.env.PORT || 5600;
app.listen(PORT, () => {
  console.log(`Listening on PORT: ${PORT}`);
})