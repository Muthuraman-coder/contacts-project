const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const multer = require('multer')
const path = require('path')
const mschema = require('./schema/schema')
const session = require('express-session')
const sschema = require('./schema/signup')


const app = express();

const mdb = 'mongodb+srv://chatgpt230:123456sS@ramdatabase1.x85e3.mongodb.net/?retryWrites=true&w=majority&appName=Ramdatabase1'
mongoose.connect(mdb)
    .then(result =>{
        app.listen(3001 ,() =>{
            console.log('server port runnig on 3001')
        })
    })

app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }));
app.set('view engine' , 'ejs')
app.use(morgan('dev'))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(session({
    secret: 'your-secret-key', 
    resave: false,
    saveUninitialized: true
}));

const storage = multer.diskStorage({
    destination:(req,file,cb) =>{
        cb(null,'uploads')
    },
    filename:(req,file,cb) =>{
        cb(null,Date.now() + path.extname(file.originalname))
    }
})

const uploads = multer({storage:storage})


app.get('/',(req,res) => {
    res.render('signin')
})

app.get('/signin',(req,res) => {
    res.render('signin')
})
app.get('/signup' , (req,res) =>{
    res.render('signup' , {alert : 'Welcome to the contact saver!'})
})

app.post('/signingin', async (req,res) => {
    const {username , password} = req.body
    sschema.findOne({username:username})
        .then((user) => {
            if(user){
                if(user.password === password){
                    req.session.userId = user._id;
                    return res.redirect(`/all-mschema/${username}`)
                    }
                else{
                    return res.render('signup' , {alert : 'OOPS! your username or password is wrong , sign up!'})
                }
            }else{
                return res.render('signup' , {alert : 'OOPS! your username  is not found , sign up!'})
            }
        })
})

app.post('/signingnup', uploads.single('image'), async (req, res) => {
    const { username, password } = req.body;
    const sameUsername = await sschema.findOne({ username });
    if (sameUsername) {
        return res.render('signup', { alert: 'Username is already taken!' });
    }
    const newUser = new sschema({ username, password });
    await newUser.save();
    res.redirect('/signin');
});

app.get('/contacts',(req,res)=>{
   res.redirect('/all-mschema/:username')
})
    
app.get('/create',(req,res) =>{
    res.render('create')
})

app.get('/about' , (req,res) =>{
    res.render('about')
})

app.get('/contact-us' , (req,res) =>{
    res.render('contact-us')
})

app.get('/help' , (req,res) =>{
    res.render('help')
})

app.get('/all-mschema/:username', (req, res) => {
    const userId = req.session.userId;

    mschema.find({ userId: userId }).sort({ createdAt: -1 })
        .then((result) => {
            res.render('index', { contacts : result });
        })
        .catch(err => {
            console.log(err);
        });
});

app.post('/all-mschema/:username', uploads.single('image'), (req, res) => {
    const { title, snippet, body } = req.body;
    const imagepath = req.file ? req.file.path : null;
    const userId = req.session.userId; 

    const newContact = new mschema({
        title,
        snippet,
        body,
        image: imagepath,
        userId: userId  
    });

    newContact.save()
        .then(result => {
            console.log('Contact saved:', result);
            res.redirect(`/all-mschema/${req.params.username}`);
        })
        .catch(err => {
            console.log(err);
        });
});


app.get('/all-mschema/:username/:id', (req, res) => {
    const { id, username } = req.params;
    mschema.findById(id)
        .then(result => {
            res.render('contact-details', { contact: result });
        })
        .catch(err => {
            console.log(err);
        });
});

app.get('/search/:username' , (req,res) => {
    const searchname = req.query.title;
    mschema.find({
        title :{$regex : searchname , $options : 'i'}
    })
     .then((result) => {
        res.render('index' ,{ contacts : result})
     })

})
  
app.delete('/all-mschema/:username/:id', (req, res) => {
    const { username, id } = req.params;
    mschema.findByIdAndDelete(id)
        .then(() => {
            res.redirect(`/all-mschema/${username}`);
        })
        .catch(err => {
            console.log(err);
        });
});

 app.use((req,res)=>{
     res.render('error')
 })