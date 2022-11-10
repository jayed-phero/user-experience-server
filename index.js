const express = require('express');
const cors = require('cors')
const jwt = require('jsonwebtoken')
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())

// user : reviewProjectDB
// password: slKgestESHlQGtCI
// require('crypto').randomBytes(64).toString('hex')

// echo "# b6a11-service-review-server-side-jayed-phero" >> README.md
// git init
// git add README.md
// git commit -m "first commit"
// git branch -M main
// git remote add origin https://github.com/Porgramming-Hero-web-course/b6a11-service-review-server-side-jayed-phero.git
// git push -u origin main


const uri = "mongodb+srv://reviewProjectDB:slKgestESHlQGtCI@cluster0.msatzvk.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const jwtTokenVerify = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'Unauthorized access. Permission not allowed' })
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {
        if (err) {
            return res.status(401).send({ message: 'Unauthorized access. Permission not allowed' })
        }
        req.decoded = decoded;
        next()
    })
}


async function run() {
    try {
        const serviceCollection = client.db('reviewDB').collection('services')
        const reviewCollection = client.db('reviewDB').collection('reviews')

        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query).sort({ $natural: -1 }).limit(3);
            const services = await cursor.toArray();
            res.send(services)
        })

        app.get('/allservices', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query)
            const services = await cursor.toArray();
            res.send(services)
        })


        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query)
            res.send(service)
        })

        // add service
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service)
            res.send(result)
        })

        // review post 
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review)
            res.send(result)
        })

        // jwt token
        app.post('/jwt', (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '10h'})
            res.send({token})
        })


        // get reviews by email id
        app.get('/myreviews', jwtTokenVerify, async (req, res) => {
            const decoded = req.decoded;
            if(decoded.email !== req.query.email){
                return res.status(403).send({message: 'Unauthorized access. Permission not allowed'})
            }
            let query = {}
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query)
            const reviews = await cursor.toArray();
            res.send(reviews)
        })

        // delete 
        app.delete('/myreviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await reviewCollection.deleteOne(query)
            res.send(result)
        })

        // edit for get one
        app.get('/reviews/:id', async (req, res) => {
            const { id } = req.params;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.findOne(query)
            res.send(result)
        })

        // update
        app.patch('/reviews/:id', async (req, res) => {
            const { id } = req.params;
            const query = { _id: ObjectId(id) }
            const updatedDoc = { $set: req.body }
            const result = await reviewCollection.updateOne(query, updatedDoc);
            if (result.modifiedCount) {
                res.send(result)
            }
        })



        // get ids reviews
        app.get('/reviewsid', async (req, res) => {
            let query = {}
            if (req.query.id) {
                query = {
                    id: req.query.id
                }
            }
            const cursor = reviewCollection.find(query)
            const reviews = await cursor.toArray();
            res.send(reviews)
        })

    }
    finally {

    }
}
run().catch(err => console.log(err))

app.get('/', (req, res) => {
    res.send('Hello from review assignment server');
})

app.listen(port, () => {
    console.log(`review assignment Listening to port ${port}`)
})