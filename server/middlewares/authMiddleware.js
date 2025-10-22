import jwt from 'jsonwebtoken'


const protect = async (req,res,next) =>{
    let token = req.headers.authorization;
    if(!token){
        return res.status(401).json({message :'Unauthorized'});
    }

    // Handle Bearer token format
    if(token.startsWith('Bearer ')){
        token = token.slice(7);
    }

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({message : 'Unauthorized'});
    }
}

export default protect