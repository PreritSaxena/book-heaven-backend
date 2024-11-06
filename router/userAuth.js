// This code defines a middleware function named authentication, which is used to verify a JWT (JSON Web Token) 
// sent by the client in the request headers. It protects routes by ensuring that only authenticated users can access them.
import jsonwebtoken from "jsonwebtoken";

export const authentication = (req,res,next) => {
    const authHeader = req.headers["authorization"]; //This header typically contains the JWT token that the client sends to prove their identity.
    const token = authHeader && authHeader.split(" ")[1];

    if(token == null){
        return res.status(401).json({message : "Authentication token required"})
    }

    jsonwebtoken.verify(token , "bookStore123" , (err,user) => {
        if(err){
           return res.status(403).json({message: "Token expired please sign in again"})
        }
        req.user = user;
        next();
    })

}
