import clientPromise from '../mongodb'

export default async (req, res) => {
    const client = await clientPromise;
    const db = await client.db('commitments');
    const bool = await db.collection('userCommitment').findOne({commitment_id: req.body});
    console.log(bool)
    res.json( { bool });
}

