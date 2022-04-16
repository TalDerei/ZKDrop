import clientPromise from '../mongodb'

export default async (req, res) => {
    const client = await clientPromise;
    const db = await client.db('commitments');
    const users = db.collection("userCommitment").insertOne(JSON.parse(req.body))
    res.json(users);

}

