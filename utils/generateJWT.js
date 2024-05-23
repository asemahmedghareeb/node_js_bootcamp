import jwt from 'jsonwebtoken';
export async function generateJWT (payload){
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' });
    return token ;
}