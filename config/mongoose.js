const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://talkio-bot:talkio123@cluster0.vtouc.mongodb.net/students?retryWrites=true&w=majority');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error!'));
db.once('open', ()=>{
    console.log('mongo connected');
});