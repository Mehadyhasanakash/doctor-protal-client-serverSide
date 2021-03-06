const express = require('express')
const app = express()
const port = process.env.PORT || 5000
var jwt = require('jsonwebtoken');
const cors = require('cors')
require('dotenv').config()

app.use(cors());

app.use(express.json());





const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aesb1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// user security jornno

function verifyJWT (req, res, next){
  console.log(abc)
  const authHeader = req.headers.authorization;
  if(!authHeader){
    return res.status(401).send({message: 'unAuthorization'})
  }
  const token = authHeader.split(' ') [1];
}

async function run() {

  try {
    await client.connect();

    console.log('db_contact')

    const doctorBooking = client.db("doctor_protal").collection('services')
    const patiendBooking = client.db("doctor_protal").collection('serviceBooking')
    const userBooking = client.db("doctor_protal").collection('users')



    app.get('/service', async (req, res) => {

      const query = {}
      const cursor = doctorBooking.find(query);
      const services = await cursor.toArray();
      res.send(services)

    })

    

    app.get('/available', async (req, res) =>{

      const date = req.query.date || 'May 17, 2022';

      const services = await doctorBooking.find().toArray()
      const query = {date: date}
      const bookings = await patiendBooking.find(query).toArray()

      services.forEach(service =>{

        const serviceBooking = bookings.filter(book => book.treatment === service.name);
        const bookSlots = serviceBooking.map(book=> book.slot);
        const available= service.slots.filter(slot => !bookSlots.includes(slot))
        service.slots = available
      })

      res.send(services)

    })

    app.get('/booking', async(req, res)=>{
      const patient = req.query.patient
      const query ={patient: patient}
      const bookings = await patiendBooking.find(query).toArray()
      res.send(bookings)

    })



    app.put('/user/:email', async(req, res) =>{
      const email = req.params.email;
      const user = req.body;
      const filter = {email: email};
      const options = {upsert: true};
      const updateDoc = {
        $set: user,
      };
      const result = await userBooking.updateOne(filter, updateDoc, options);
      var token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
      res.send({result, token})
    })



    app.post('/booking', async (req, res) => {
      const booking = req.body;
      const query = { treatment: booking.treatment, date: booking.date, patient: booking.patient }
      const exists = await patiendBooking.findOne(query)
      
      if (exists) {
        return res.send({ success: false, booking: exists })
      }
      const result = await patiendBooking.insertOne(booking);
      return res.send({ success: true, result })
      console.log(result)
    })



    // app.put('/user/:email', async(req, res) =>{
    //   const email = req. params.email;
    //   const user = req.body
    //   const filter = { email: "email" };
    //   const options = { upsert: true };
    //   const updateDoc = {
    //     $set: user,
    //   };
    //   const result = await userCollection.updateOne(filter, updateDoc, options);
    //   res.send(result)


    // })

    

  }
  finally {

  }
}
run().catch(console.dir);








app.get('/', (req, res) => {
  res.send('hi myh nam is akash')
})













app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})