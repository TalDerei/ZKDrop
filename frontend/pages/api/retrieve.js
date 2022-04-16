import clientPromise from '../mongodb'

export default async (req, res) => {
    const client = await clientPromise;
    const db = await client.db('commitments');
    const users = await db.collection('userCommitment').find({}).limit(100).toArray();
    res.json(users);
}

