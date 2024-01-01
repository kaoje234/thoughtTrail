exports.homepage=async(req,res)=>{
        const locals={
            title:'ThoughtsTrail',
            description:'Free NodeJs Notes App'
        }
        res.render('index',{
            locals,
            layout: '../views/layouts/front-page'
        });
}

// Get About 

exports.about=async(req,res)=>{
    const locals={
        title:'About- ThoughtsTrail',
        description:'Free NodeJs Notes App'
    }
    res.render('about',locals);
}