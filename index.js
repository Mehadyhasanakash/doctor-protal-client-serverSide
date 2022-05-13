const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors')
require('dotenv').config()

app.use(cors());

app.use(express.json());





const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aesb1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {

try{
    await client.connect();

    console.log('db_contact')

    const doctorBooking = client.db("doctor_protal").collection('services')

   
   
    app.get('/service', async(req, res) =>{

        const query ={}
        const cursor = doctorBooking.find(query);
        const services = await cursor.toArray();
        res.send(services)
       
    })

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