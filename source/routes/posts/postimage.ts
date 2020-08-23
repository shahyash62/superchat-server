// import express from 'express';
// import path from 'path';
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });
// import { AuthenticateUser } from '../../authentication/AuthenticateUser';
// import { saveImage, forwardImageToFriends } from '../../helper_functions/ImageHelpers';
// import { findUserData } from '../../helper_functions/UserCheck';
// // const Status = require('../../models/Status');

// //Image Model
// // const Image = require('../../models/Image');

// const router = express();

// // Data inputs = jwt token, username, img
// router.post('/postimage', upload.single('file'), (req, res) => {
//     const reqCopy: any = req;
//     // console.log(reqCopy.file);
//     let filePath = path.join('D:\\1A\\workSpace\\zen-io\\server\\uploads\\', reqCopy.file.filename);
//     console.log(filePath);
//     findUserData(req.body.username).then((userData) => {
//         console.log(userData);
//         if (!userData) return;
//         const image = {
//             username: userData.username,
//             usersWithAccess: userData.friendList.map((userObject: { username: string }) => userObject.username),
//             filePath,
//         };
//         // 1. Save Image
//         saveImage(image).then((data) => {
//             if (!data.error) {
//                 // 2. Forward Image to receipients
//                 forwardImageToFriends(userData.friendList, data._id).then((functionResponse) => {
//                     // 3. Return success message
//                     if (!functionResponse.error) res.status(200).json({ file: data });
//                     else res.status(500).json({ error: functionResponse.error });
//                 });
//             } else {
//                 res.status(500).json({ error: data });
//             }
//         });
//     });
// });

// module.exports = router;
