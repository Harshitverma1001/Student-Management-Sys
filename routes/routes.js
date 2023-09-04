const express=require('express');
const router=express.Router();
const User=require('../models/users');     // Importing the Mongoose schema from users.js
const multer=require('multer');            // Multer is used for handeling file uploads in the form data.
const fs=require('fs'); 
const { log } = require('console');

// image upload
var storage=multer.diskStorage({          // multer.diskStorage() is a function provided by the Multer library that creates a new storage engine based on disk storage. It takes an object as an argument, which defines the destination and filename of the uploaded file.
    destination: function(req,file,cb){
        cb(null,'./uploads');
    },
    filename: function(req,file,cb){
        cb(null,file.fieldname+"_"+Date.now()+"_"+file.originalname);
    },
});

var upload=multer({         // This is middleware
    storage: storage,
}).single('image');

// Insert an user into database route
// router.post('/add',upload,(req,resp)=>{
//     const user=new User({
//         name:req.body.name,
//         email:req.body.email,
//         phone:req.body.phone,
//         image:req.file.filename,      // This filename is coming dynamically from line 14;
//     });
//     user.save((err)=>{                // This "save" is the function from the mongoose library.
//         if(err){
//             resp.json({message: err.message, type: 'danger'});
//         }
//         else{
//             req.session.message={
//                 type:'success',
//                 message: 'User added successfully'
//             };
//             resp.redirect('/');           // After adding the user it will redirect the user to homepage.
//         }
//     });
// });

// MongooseError: Model.prototype.save() no longer accepts a callback 
// Getting this error in the above code
// Solution:-
router.post('/add',upload,async(req,resp)=>{
    try{
        const user=new User({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: req.file.filename,
        });

        await user.save();
        req.session.message={
            type: 'success',
            message: 'User added successfully'
        };

        resp.redirect('/');
    }
    catch(err){
        resp.json({message: err.message, type: 'danger'});
    }
});


// // Get all users route
// router.get("/", (req,resp)=>{
//     User.find().exec((err,users)=>{
//         if(err){
//             resp.json({message: err.message});
//         }
//         else{
//             resp.render('index',{
//                 title: 'Home Page',
//                 users: users,
//             });
//         }
//     });
// });

router.get("/", async (req, resp) => {          // This route is getting all the users data from the database.
    try {
      const users = await User.find();
      resp.render("index", {
            title: "Home Page",
            users: users,
        });
    } catch (err) {
        resp.json({ message: err.message });
    }
});
  

// router.get("/", (req,resp)=>{
//     resp.render("index",{title:'Home page'});
// });

router.get('/add',(req,resp)=>{
    resp.render("add_users",{title:"Add Users"});
});

// Edit an user route
// router.get('/edit/:id',(req,resp)=>{
//     let id=req.params.id;
//     User.findById(id,(err,user)=>{
//         if(err){
//             resp.redirect('/');
//         }
//         else{
//             if(user==null){
//                 resp.redirect('/');
//             }
//             else{
//                 resp.render('edit_users',{
//                     title: "Edit Users",
//                     user: user,
//                 });
//             }
//         }
//     })
// });
// MongooseError: Model.findById() no longer accepts a callback
// Getting this error in the above code
// Solution:-
router.get('/edit/:id',async(req,resp)=>{
    try{
        const id=req.params.id;
        const user=await User.findById(id).exec();

        if(user==null){
            resp.redirect('/');
        }
        else{
            resp.render('edit_users',{
                title: 'Edit Users',
                user: user,
            });
        }
    }catch(err){
        resp.redirect('/');
    }
});


// Update User Route
// router.post('/update/:id',upload,(req,resp)=>{
//     let id=req.params.id;
//     let new_image='';

//     if(req.file){
//         new_image=req.file.filename;
//         try{
//             fs.unlinkSync('./uploads'+req.body.old_image);
//         }
//         catch(err){
//             console.log(err);
//         }
//     }
//     else{
//         new_image=req.body.old_image;
//     }

//     User.findByIdAndUpdate(id,{
//         name: req.body.name,
//         email: req.body.email,
//         phone: req.body.phone,
//         image: new_image,
//     },(err,result)=>{
//         if(err){
//             resp.json({message: err.message, type: 'danger'});
//         }
//         else{
//             req.session.message={
//                 type: 'success',
//                 message: 'User updated successfully',
//             };
//             resp.redirect('/');
//         }
//     })

// });
// MongooseError: Model.findByIdAndUpdate() no longer accepts a callback
// Solution:
router.post('/update/:id',upload,async(req,resp)=>{
    try{
        const id=req.params.id;
        let new_image='';

        if(req.file){
            new_image=req.file.filename;
            try{
                await fs.unlink('./uploads'+req.body.old_image);
            }catch(err){
                console.log(err);
            }
        }
        else{
            new_image=req.body.old_image;
        }

        const updateUser={
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: new_image,
        };

        const result=await User.findByIdAndUpdate(id,updateUser,{
            new: true,
            useFindAndModify: false,
        });

        req.session.message={
            type: 'success',
            message: 'User updated Successfully',
        };

        resp.redirect('/');
    }catch(err){
        resp.json({message: err.message, type: 'danger'});
    }
});


// Delete user route
// router.get('/delete/:id', (req,resp)=>{
//     let id=req.params.id;
//     User.findByIdAndRemove(id, (err, result)=>{
//         if(result.image!=''){
//             try{
//                 fs.unlinkSync('./uploads/'+result.image);
//             }
//             catch(err){
//                 console.log(err);
//             }
//         }

//         if(err){
//             resp.json({message: err.message});
//         }
//         else{
//             resp.session.message={
//                 type: info,
//                 message: "User deleted successfully",
//             };
//             resp.redirect('/');
//         }
//     })
// })
// MongooseError: Model.findByIdAndRemove() no longer accepts a callback
// getting this error in the above code
// Solution:-
router.get('/delete/:id',(req,resp)=>{
    let id=req.params.id;
    User.findByIdAndRemove(id).then((result)=>{
        if(result.image!=''){
            try{
                fs.unlinkSync('./uploads/'+result.image);
            }
            catch(err){
                console.log(err);
            }
        }

        req.session.message={
            type: 'info',
            message: 'User deleted successfully',
        };
        resp.redirect('/');
    }).catch((err)=>{
        resp.json({message: err.message});
    });
});

module.exports=router;

