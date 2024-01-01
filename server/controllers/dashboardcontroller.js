
const Note = require('../models/Notes')
const mongoose = require('mongoose');


//get dashboard controller
// exports.dashboard = async (req, res) => {

//     let perPage = 12;
//     let page = req.query.page || 1


//     const locals = {
//         title: 'Dashboard',
//         description: 'Free NodeJs Notes App'
//     }

//     try {
//         Note.aggregate([
//             {
//                 $sort: {
//                     createdAt: -1,
//                 }
//             },
//             { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
//             {
//                 $project: {
//                     title: { $substr: ['$title', 0, 30] },
//                     body: { $substr: ['$body', 0, 100] }
//                 }
//             }
//         ])
//             .skip(perPage * page - perPage)
//             .limit(perPage)
//             .exec(function (err, notes) {
//                 Note.count().exec(function (err, count) {
//                     if (err) return next(err);

//                     res.render('dashboard/index', {
//                         userName: req.user.firstName,
//                         locals,
//                         notes,
//                         layout: '../views/layouts/dashboard',
//                         current: page,
//                         pages: Math.ceil(count / perPage)
//                     });
//                 })
//             })
//     } catch (error) {
//         console.log(error)
//     }
// }
exports.dashboard = async (req, res, next) => {
    let perPage = 8;
    let page = req.query.page || 1;

    const locals = {
        title: 'Dashboard',
        description: 'Free NodeJs Notes App'
    };

    try {
        const notes = await Note.aggregate([
            {
                $sort: {
                    createdAt: -1,
                }
            },
            { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
            {
                $project: {
                    title: { $substr: ['$title', 0, 30] },
                    body: { $substr: ['$body', 0, 100] }
                }
            }
        ])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();

        const count = await Note.countDocuments().exec();

        res.render('dashboard/index', {
            userName: req.user.firstName,
            locals,
            notes,
            layout: '../views/layouts/dashboard',
            current: page,
            pages: Math.ceil(count / perPage)
        });
    } catch (error) {
        console.log(error);
        //next(error); Pass the error to the next middleware
    }
};


/*
View specific note
*/

exports.dashboardViewNote = async (req, res) => {
    const note = await Note.findById({ _id: req.params.id })
        .where({ user: req.user.id }).lean();

    if (note) {
        res.render('dashboard/view-note', {
            noteID: req.params.id,
            note,
            layout: '../views/layouts/dashboard'
        });
    }
    else {
        res.send("Something went wrong...")
    }
}
/*Updating specific note
*/

exports.dashboardUpdateNote = async (req, res) => {
    try {
       await Note.findByIdAndUpdate(
        {_id: req.params.id},
        {title: req.body.title, body: req.body.body }
        ).where({user:req.user.id});
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error)
    }
}

//Delete Note
exports.dashboardDeleteNote=async (req,res)=>{
    try {
        await Note.deleteOne({_id: req.params.id}).where({user: req.user.id});
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error)
    }
}

//add notes
exports.dashboardAddNote=async(req,res)=>{
    res.render('dashboard/add',{
       layout: '../views/layouts/dashboard' 
    });
}

//post add notes
exports.dashboardAddNoteSubmit=async(req,res)=>{
    try {
        req.body.user=req.user.id;
        await Note.create(req.body)
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error)
    }
}