import { DecodeToken } from '../utility/TokenUtility.js';

export default (req, res, next) => {
    let token = req.cookies.token;
    if (!token) {
        token = req.headers['token'];
    }
    let decoded = DecodeToken(token); 

    if (decoded === null) {
        return res.status(401).json({ status: 'Fail', message: 'Unauthorized' });
    } else {
        const {email, user_id} = decoded;
        req.headers.email = email;
        req.headers.user_id = user_id;
        next(); 
    }
};



// export default (req, res, next) => {
//     let token = req.cookies.token;
//     if (!token) {
//         token = req.headers['token'];
//     }
//     let decoded = DecodeToken(token); 

//     if (decoded === null) {
//         return res.status(401).json({ status: 'Fail', message: 'Unauthorized' });
//     } else {
//         const {email, user_id} = decoded;
//         req.headers.email = email;
//         req.headers.user_id = user_id;
//         next(); 
//     }
// };