var http = require('http');
var express = require('express');
var router = express();
var server = http.createServer(router);
var app = express();

app.use(express.bodyParser());

var alreadyAnsweredText = "It looks like your question has already been answered. Here is the author's response: ";
var alreadyAnsweredText2 = "I found an answer. The author replied: ";
var authorResponses = {"Why did you chose the number 42?" : "The answer to this is very simple. It was a joke. \
Binary representations, base thirteen, Tibetan monks are all complete nonsense. I sat at my desk, stared into \
the garden and thought: '42 will do'. End of story.",
  "Answer to the Ultimate Question of Life?":"42."
}
var bookYouAreReading = "What's your question? It looks like you're reading Twilight: The Complete Saga."
var newQuestion = "Who was the inspiration for the anti-hero Author Dent?";

app.get('/echo', function (req, res) {
  res.send('Hello Alexa!');
});

app.post('/echo', function (req, res) {
  
  console.log(req.body);
  
  var shouldEndSession = false;
  
  var requestType = req.body.request.type;
  var intent = req.body.request.intent;
  var slots = [];
  var responseText;
  console.log(req.body.request);
  if (requestType === undefined) {
      responseText = "Sorry I didn't catch that, which book are you reading?";
  } else {
      if (requestType == "LaunchRequest") {
          responseText = bookYouAreReading;
      } else {
        var intentName = intent.name;
        slots  = intent.slots;
      
        if (intentName == 'AskTheAuthor') {
          var question = slots.Question.value;
          console.log("AskTheAuthor: " + question);
          if (question.indexOf("forty two") > -1 || question.indexOf("forty-two") > -1) {
            responseText = alreadyAnsweredText2 + authorResponses["Why did you chose the number 42?"];
          } else {
            responseText = "Sounds like a new question. I'll ping the author and email you if he replies.";
            shouldEndSession = true;
          }
        } 
        
        if (intentName == 'SelectBook') {
            var book = slots.Book.value;
            console.log("book" + book);
            responseText = "What should I ask Douglas Adams?";
        }
        
        if (intentName == 'Yes') {
            responseText = "Ok. What should I ask the author?";
        }
        
      }
  }
  var data = {
    "version": "1.0",
    "sessionAttributes": {
    },
    "response": {
      "outputSpeech": {
        "type": "PlainText",
        "text": responseText
      },
      "card": {
        "type": "Simple",
        "title": "Ask an Author",
        "subtitle": "Your question was asked to the author.",
        "content": responseText
      },
      "shouldEndSession": shouldEndSession
    }
  };
  
  var dataString = JSON.stringify(data);

  res.set({'Content-Type':'application/json;charset=UTF-8',    
'Content-Length': Buffer.byteLength(dataString, 'utf-8')});  
  
  res.send(dataString);
});

var server = app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
