const express = require('express')
const cors = require('cors')
const app = express();
require('dotenv').config()

const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.DB_USER;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try {
        const serviceCollection = client.db('reviewAssignment').collection('services')

        app.get('/services', async(req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query).limit(3);
            const services = await cursor.toArray();
            res.send(services)
        })
    } 
    finally{
        
    }
}
run()






app.get('/', (req, res) => {
    res.send('Review assignment server is running ')
})

app.listen(port, () => {
    console.log(`Listening to port ${port}`)
})

























// echo "# b6a11-service-review-server-side-jayed-phero" >> README.md
// git init
// git add README.md
// git commit -m "first commit"
// git branch -M main
// git remote add origin https://github.com/Porgramming-Hero-web-course/b6a11-service-review-server-side-jayed-phero.git
// git push -u origin main