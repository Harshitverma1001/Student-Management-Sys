// router.post('/add',upload,async(req,resp)=>{
//     try{
//         const user=new User({
//             name: req.body.name,
//             email: req.body.email,
//             phone: req.body.phone,
//             image: req.file.filename,
//         });
//         await user.save();

//         req.session.message={
//             type:'success',
//             message: 'User added successfully',
//         }

//         resp.redirect('/');
//     }
//     catch(err){
//         resp.json({message: err.message, type: 'danger'});
//     }
// });



// router.get('/',async(req,resp)=>{
//     try{
//         const users=await User.find();
//         resp.render('index',{
//             title: 'Home Page',
//             users: users,
//         });
//     }
//     catch(err){
//         resp.json({message: err.message});
//     }
// });




router.get('/edit/:id',async(req,resp)=>{
    try{
        const id=req.params.id;
        const user=await User.findById(id).exec();

        if(user==null){
            resp.redirect('/');
        }
        else{
            resp.render('edit_users',{
                title: 'Edit User',
                users: users,
            });
        }
    }
    catch(err){
        resp.redirect('/');
    }
});



router.post('./update/:id', upload, async(req,resp)=>{
    try{
        const id=req.params.id;
        let new_image='';

        if(req.file){
            new_image=req.file.filename;
            try{
                fs.unlink('./uploads'+req.body.old_image);
            }catch(err){
                console.log(err);
            }
        }else{
            new_image=req.body.old_image;
        }

        const updateUser={
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: new_image,
        };

        const result=await User.findByIdAndUpadte(id,updateUser,{
            new: true,
            useFindAndModify: false,
        });

        req.session.message={
            type: 'success',
            message: 'User updated successfully',
        };
        resp.redirect('/');
    }catch(err){
        resp.json({message: err.message, type:'danger'});
    }
});


router.get('/delete/:id',(req,resp)=>{
    let id=req.params.id;
    User.findByIdAndRemove(id).then((result)=>{
        if(result.image){
            try{
                fs.unlinkSync('./uploads/'+result.image);
            }catch(err){
                console.log(err);
            }
        }

        req.session.message={
            type: 'info',
            message: 'User deleted successfully',
        };
    }).catch((err)=>{
        resp.json({message: err.message});
    });
});

// What is the differenvce between fs.unlinkSync and fs.unlink