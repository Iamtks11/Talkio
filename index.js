const TelegramBot = require('node-telegram-bot-api');

//the Telegram token you receive from @BotFather
const token = '5248611356:AAE_DUuiqxBL3Ep_2IqRZSRqeb5Xe2-dn2o';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});


//mongoose
const db = require('./config/mongoose');
const student = require('./models/student');

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  console.log(msg);
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});


//To show all records in DB
bot.onText(/\/show/, (msg, match) =>{
  const chatId = msg.chat.id;
  student.find({}, function(err, students){
    if(err){
        console.log('can\'t fetch contacts');
        bot.sendMessage(chatId, 'can\'t fetch contacts');
        return;
    }
    else{
      let rBack = "Students Database List:-\n\n";
      for(std of students)
      {
        rBack+= 'Name: '+std.name+'\n'+
                'Roll No.: '+std.roll+'\n'+
                'Marks: '+std.marks+'\n\n';
      }
      bot.sendMessage(chatId, rBack);
    }
});

});


//To show all records of DB in sorted order
bot.onText(/\/sorted/, (msg, match) =>{
  const chatId = msg.chat.id;
  student.find({}).sort({name: "asc"}).exec((err, students)=>{
    let rBack = "Students Database List:-\n\n";
      for(std of students)
      {
        rBack+= 'Name: '+std.name+'\n'+
                'Roll No.: '+std.roll+'\n'+
                'Marks: '+std.marks+'\n\n';
      }
      bot.sendMessage(chatId, rBack);
  });
});

//Sort in descending order of marks
bot.onText(/\/sortByMarks/, (msg, match) =>{
  const chatId = msg.chat.id;
  student.find({}).sort({marks: "desc"}).exec((err, students)=>{
    let rBack = "Students Database List:-\n\n";
      for(std of students)
      {
        rBack+= 'Name: '+std.name+'\n'+
                'Roll No.: '+std.roll+'\n'+
                'Marks: '+std.marks+'\n\n';
      }
      bot.sendMessage(chatId, rBack);
  });
});


//add a new record in format '/add <name> <roll no.> <marks>'
bot.onText(/\/add (.+)/, (msg, match) =>{
  const chatId = msg.chat.id;
  var info = match[1];
  let arr = info.split(" ");
  let n = arr.length;
  console.log(arr);
  console.log(n);
  if(n<3) return;
  let Name = "";
  for(let i=0;i<n-2;i++)
  {
    if(i!=n-3)
      Name+= arr[i]+" ";
    else
      Name+=arr[i];
  }
  student.create({
    name: Name,
    roll: arr[n-2],
    marks: arr[n-1]
  }, (err, newStudent)=>{
    if(err){
        console.log('cannot create new contact, reason: ', err);
        let rBack = 'cannot create new contact, reason: '+ toString(err);
        bot.sendMessage(chatId, rBack);
    }
    else{
      let rBack = 'New Student Created:\n '+ 'Name: ' + newStudent.name;
      console.log("***", newStudent);
        bot.sendMessage(chatId, rBack);

    }
    
});
  

});


//to delete a record by roll number in format '/remove <roll no.>'
bot.onText(/\/remove (.+)/, (msg, match) =>{
  const chatId = msg.chat.id;
  student.remove({roll: match[1]}, function(err){
    if(err){
        console.log('Record was not found.\nError: ', err);
        bot.sendMessage(chatId, 'Record was not found.\n');
        return;
    }
    else{
      bot.sendMessage(chatId, 'Record was deleted Successfully.\n');
    }
})

});

//to search a record by roll number '/searchByRoll <roll no.>'
bot.onText(/\/searchByRoll (.+)/, (msg, match) =>{
  const chatId = msg.chat.id;

  student.find({roll: match[1]}, (err, students)=>{
    if(err){
      let rBack = "Couldn't find any matches.";
      bot.sendMessage(chatId, rBack);
      
    }
    else{
      let rBack = "Match Found:-\n";
      let std = students[0];
      rBack+= 'Name: '+std.name+'\n'+
              'Roll No.: '+std.roll+'\n'+
              'Marks: '+std.marks+'\n\n';
      bot.sendMessage(chatId, rBack);

    }
    
  })

});

//To update a record '/update <roll no.>'
bot.onText(/\/update (.+)/, (msg, match) =>{
  const chatId = msg.chat.id;
  let info = match[1];
  let arr = info.split(" ");
  let rollNo = arr[0];
  let n= arr.length;
  let Marks = arr[n-1];
  let newRoll = arr[n-2];
  let Name="";
  console.log(rollNo, newRoll, Name, Marks);
  for(let i=1;i<n-2;i++)
  {
    if(i!=n-3)
      Name+=arr[i]+" ";
    else
      Name+=arr[i];

  }
  
  student.findOneAndUpdate({roll: rollNo}, {
    name: Name,
    roll: newRoll,
    marks: Marks
  }, (err, students)=>{
    if (err){
      console.log(err);
      let rBack = "Couldn't find matching record\n";
      bot.sendMessage(chatId, rBack);

    }
    else{
        let rBack = `Record with roll number:${rollNo} was updated.\nNew roll number: ${newRoll}`;

        bot.sendMessage(chatId, rBack);
    }
  });

});