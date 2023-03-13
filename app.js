var express = require("express");
var app = express();
const PORT = process.env.PORT || 3030;
var mon = require("mongoose");
var bp = require("body-parser");
var me = require("method-override");
var path = require('path');
const req = require("express/lib/request");



mon.connect(
    process.env.MONGODB_URI ||
      "mongodb+srv://user:user@cluster0.xelap.mongodb.net/<dbname>?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to DB!"))
  .catch((error) => console.log(error.message));

app.set("view engine", "ejs");
path.join("bookies", 'views')
path.join("songs", 'views')
path.join("foods", 'views')
path.join("stories", 'views')



app.use(express.static("public"));
app.use(bp.urlencoded({ extended: true }));
app.use(me("_method"));


//EPUB MINE
var story = mon.Schema({
  name: String,
  writer: String,
  year: Number,
  cover: String,
  fullcover: String,
  series: String,
  seriesnum: String,
  price: String,
  paybutton: String,
  summary: String,
  aboutstory: String,
  title1: String,
  prolog: String,
  title2: String,
  firstChapter: String,
  comments: [{name:String, email: String, text:String}]
})


var Story = mon.model("Story", story)

app.get("/", function(req, res){
  res.redirect("/indexstories")
})

//STORY index
app.get("/indexstories", function(req, res){
  Story.find({}, function(err, allstories){
    if(err){
      console.log("the error "+ err);
    }else{
      res.render("stories/indexstories", {allstories:allstories})
    }
  })
})

//STORY CREATE - GET AND POST
app.get("/createstory", function(req, res){
  res.render("stories/createstory")
})

app.post("/storycr", function(req,res){
  Story.create(req.body.story, function(err, newst){
    if(err){
      res.send("err")
    }else{
      res.redirect("/indexstories")
    }
  })
})

//STORY SHOW
app.get("/showstory/:id", function(req, res){
  Story.findById(req.params.id, function(err, showedstory){
    Story.find({series: showedstory.series}, function(err1, seriesBooks){
      if(err|| err1){
        res.send("err")
      }else{
        res.render("stories/showstory", {showedstory:showedstory, series: seriesBooks})
      }

    })
   
  })
})



//STORY EDIT AND UPDATE
app.get("/editstory/:id", function(req, res){
  Story.findById(req.params.id, function(err, editit){
    if(err){
      res.send("err")
    }else{
      res.render("stories/editstory", {editit:editit})
    }
  })
})

app.put("/updatestory/:id", function(req, res){
  Story.findByIdAndUpdate(req.params.id, req.body.story, function(err, updated){
    if(err){
      res.send("err")
    }else{
      res.redirect("/indexstories")
    }
  })
})

//STORY DELETE
app.delete("/deletestory/:id", function(req,res){
  Story.findOneAndRemove(req.params.id, function(err){
    if(err){
      res.send("err")
    }else{
      res.redirect("/indexstories")
    }
  })

})


// COMMENTS
// create a comment
app.post("/createcomment/:id", function(req, res){
  var com = req.body.comment
  var id = req.params.id //bookid
 Story.findByIdAndUpdate(id, { $push: { comments: com  } }, function(err, foundbook){
   if(err){res.send("error")}
   else{
res.redirect("/showstory/" +id)
   }
 })
})

// comments index
app.get("/commentsindex/:id", function(req,res){
  var id = req.params.id
  Story.findById(id, function(err, found){
    if(err){res.send("error")}
    else{
      res.render("stories/commentsindex", {commentsarr: found.comments, bookid: id})
    }
  })
})

// edit comment
app.get("/editcomment/:bookid/:index", function(req,res){
  var commentid = req.params.index
var bookid = req.params.bookid
Story.findById(bookid, function(err, foundbook){
  if(err){res.send("error")}
  else{
    var updatecomment = foundbook.comments[commentid]
    res.render("stories/editcomment",{ updatecomment: updatecomment, commentid: commentid, bookid: bookid})
  }
})
 
})

app.put("/editcomment/:bookid/:index", function(req, res){
  var commentid = req.params.index
 var bookid = req.params.bookid
   var updatedC = req.body.comment
   Story.findById(bookid, function(err, foundbook){
     if(err){res.send("error")}
     else{
       foundbook.comments.set(commentid, updatedC)
        foundbook.save();
       res.redirect("/commentsindex/"+foundbook._id)}
   })
 })

 // delete comment
app.delete("/deletecomment/:bookid/:commentid", function(req,res){
  var bookid = req.params.bookid
  var commentid = req.params.commentid
  Story.findById(bookid, function(err, foundbook){
    if(err){res.send("error")}
    else{
      foundbook.comments.splice (commentid, 1)
       foundbook.save();
      res.redirect("/commentsindex/"+foundbook._id)}
  })

})

 

// BOOK collection
var hand = new mon.Schema({
  catagory: String,
  name: String,
  writer: String,
  series: Boolean,
  genere: String,
img: String,
  summary: String,
  pay: String
})

var Hand = mon.model("Hand", hand)



// BOOK create
app.get("/bookcreate", function(req, res){
  res.render("bookies/createbook")
})

app.post("/bookcr", function(req, res){
  Hand.create(req.body.book, function(err, newbook){
    if(err){
      res.send("err")
    }else{
      res.redirect("/indexbooks")
    }
  })
})

//BOOK index
app.get("/indexbooks", function(req,res){
  Hand.find({}, function(err, indexbooks){
    if(err){
      res.send("err")
    }else{
      res.render("bookies/indexbooks", {indexbooks:indexbooks})
    }
  })
})
//BOOK show
app.get("/showbook/:id", function(req,res){
  Hand.findById(req.params.id, function(err1, showedbook){
    Hand.find({writer: showedbook.writer}, function(err2, series){
      if((err1)||(err2)){
        res.send("err")
      }else{
        res.render("bookies/showbook", {showedbook:showedbook, series:series})
      }
    })
    })
   
})

//BOOK edit
app.get("/editbook/:id", function(req,res){
  Hand.findById(req.params.id, function(err, editit){
    if(err){
      res.send("err")
    }else{
      res.render("bookies/editbook", {editit:editit})
    }
  })
})

app.put("/updatebook/:id", function(req, res){
  Hand.findByIdAndUpdate(req.params.id, req.body.book, function(err, updated){
    if(err){
      res.send("err")
    }else{
      res.redirect("/indexbooks")
    }
  })

})

// BOOK delete
app.delete("/deletebook/:id", function(req,res){
  Hand.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.send("err")
    }else{
      res.redirect("/indexbooks")
    }
  })
})

// BOOK search
app.post("/searchbook", function(req, res){
  var searchinput = req.body.searchinput
  var booksresults = []
  Hand.find({}, function(err, searchbooks){
    if (err){
      res.send("err")
    } else{
      searchbooks.forEach(function(book){
        if(book.name.includes(searchinput) || book.writer.includes(searchinput) ){
          booksresults.push(book)
        }
      })
      res.render("bookies/searchpage", {searchinput: searchinput, booksresults:booksresults})
    }
  })

})



app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});

