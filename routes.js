const express = require('express')
const route = express.Router();
//taking data base
const {addNewUsers , findOneUser} = require('./controllers/user')
const {createAPost , FindAllPost , findPostById} = require('./controllers/post')
//requiring module
const {Users , db , Posts} = require('./db')
//to protect the password
const bcrypt = require('bcryptjs')

const passport = require('passport')

const session = require('express-session')
const cookieParser = require('cookie-parser')
//install ing connect-flash
const flash = require('connect-flash');

route.use(cookieParser('secret'))
route.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}))

route.use(passport.initialize())
route.use(passport.session())

//set up of flash and the middleware
route.use(flash())
//creating up of a middleware ==> flash
route.use(function(req , res , next){
    res.locals.success_message = req.flash('success_message')//name must be same "success_message"
    res.locals.error_message = req.flash('error_message')//name must be same "error_message"
    res.locals.error = req.flash('error')//default to write
    next()
})
//is authenticated IF ANY ONE CLICKS THE BACK BUTTON
const checkAuthenticated = function(req , res , next) {
    if(req.isAuthenticated()){
        res.set('cache-control' , 'no-cache,private,no-store,must-revalidate,post-check=0,pre-check=0')
        return next()
    }else{
        res.redirect('/login')
    }
}
//this is the first and second step to run and stode the data in the db
//get request on register page
route.get('/register' , (req , res) => {
    res.render('index')
})
//post request on register page
route.post('/register' , async (req , res) => {
    // console.log(req.body.email)
    // console.log(req.body.password1)
    // console.log(req.body.password2)
    if((!req.body.email) || (!req.body.password1) || (!req.body.password2)){
        const err = "Please Enter Complete Credentials"
        return res.render('index' , { err })
    }
    if(req.body.password1 != req.body.password2){
        const err = "Please Enter same password in both fields"
        return res.render('index', { err })
    }//check if uniqueness is disturbed
    const userByEmail = await findOneUser(req.body.email)
    // console.log(userByEmail)
    if(userByEmail != null){
        const err = "This Email Id Already Exist Pls Choose Another"
        return res.render('index', {err})
    }
    //securing the password by hashing
    const hash = await bcrypt.hash(req.body.password1 , 9)
    // console.log(hash)
    const user = await addNewUsers(req.body.email , hash)
    // console.log(user)
    req.flash('success_message','Register Successfully.. Login To Continue')
    //1 -> we redirect to any page than the link in the bar changes
    //2 -> while if we render the things than the link do not change
    //3 -> but when we redirect the things than we can not send the data to the next page to which redirected
    //4 -> this is done usin this npm connect-flash
    res.redirect('/login')
})
//Authentication Stratgey
const localStrategy = require('passport-local').Strategy;
passport.use(new localStrategy({usernameField: 'email'} , async (username , password , done) => {
    const userFind = await Users.findOne({where: {
        email: username
    }})
    if(!userFind){
        return done(null , false , {message : 'User Dose not exist'});
    }
    const validPassword = await bcrypt.compare(password, userFind.password)
    if(!validPassword){//messages are displayed threw flash ==> only present on "/login" page not on success page
        return done(null , false , {message: 'Password Dont match'} );
    }
    if(validPassword){
        return done(null , userFind);
    }
}))

//end of authentication
passport.serializeUser(function(user , cb){
    cb(null , user.id)
})
passport.deserializeUser(function(id , done){
    Users.findOne({
        where:{
            id
        }
    }).then(function(user) {
        if(user == null){
            done(new Error('wrong user id'))
        }
        done(null , user)
    }).catch((err) => {console.error(err);})
})


//get request on login page
route.get('/login' , async (req , res) => {
    res.render('login')
})

//post request on login page
route.post('/login' , async (req , res , next) => {
    passport.authenticate('local' , {
        failureRedirect: '/login',
        successRedirect: '/success',
        failureFlash: true,
        successFlash: true
    })(req , res , next)
})
route.get('/success' , checkAuthenticated ,(req , res) => {
    res.render('success');
})
route.get('/logout' , (req , res) => {
    // console.log('hii')
    req.logout()
    res.redirect('/login')
})
route.get('/writepost' , (req , res) => {
    res.render('writePost')
})

route.post('/writepost' , async (req , res) => {
    const post = await createAPost(req.user.id , req.body.title,req.body.body)
    // console.log(post)
    // console.log(req.body.title)
    // console.log(req.body.body)
    // console.log(req.user.email)
    res.send('Successfully Added the posts')
})
route.get('/api/mypost', async (req , res) => {
    // console.log(req.user.id)
    const posts = await findPostById(req.user.id);
    // console.log (posts)
    res.send(posts)
})
// route.post('/api/mypost' ,  async (req , res) => {
//     const posts = await findPostById(req.user.id);
//     // console.log (posts)
//     res.send(posts)
// })
route.get('/api/allposts' , async (req , res) => {
    const posts = await FindAllPost();
    res.send(posts)
})
route.get('/chat' , (req , res) => {
    // console.log(req.user.email)
     res.render('chat' , {
        userName: req.user.email
     })
})
module.exports = {
    route
}