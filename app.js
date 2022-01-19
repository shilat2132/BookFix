var express = require("express");
var app = express();
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
  price: Number,
  paybutton: String,
  summary: String,
  additionalinfo: String
})

var Story = mon.model("Story", story)

//STORY index
app.get("/indexstories", function(req, res){
  Story.find({}, function(err, allstories){
    if(err){
      res.send("err")
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
    if(err){
      res.send("err")
    }else{
      res.render("stories/showstory", {showedstory:showedstory})
    }
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

//BOOK home
app.get("/homebooks", function(req, res){
  res.render("bookies/homebooks")
})

// BOOK create
app.get("/bookcreate", function(req, res){
  res.render("bookies/createbook")
})

app.post("/bookcr", function(req, res){
  Hand.create(req.body.book, function(err, newbook){
    if(err){
      res.send("err")
    }else{
      res.redirect("/homebooks")
    }
  })
})

//BOOK index
app.get("/indexbooks/:catagory", function(req,res){
  Hand.find({catagory: req.params.catagory}, function(err, indexbooks){
    if(err){
      res.send("err")
    }else{
      res.render("bookies/indexbooks", {indexbooks:indexbooks, catagory: req.params.catagory})
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
      res.redirect("/homebooks")
    }
  })

})

// BOOK delete
app.delete("/deletebook/:id", function(req,res){
  Hand.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.send("err")
    }else{
      res.redirect("/homebooks")
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

//lyrics
var song = new mon.Schema({
  name: String,
  singer: String,
  lyrics: String,
  series: Boolean
})

var Song = mon.model("Song", song)


// SONG create - get and post
app.get("/createsong", function(req, res){
  res.render("songs/createsong")
})

app.post("/songcr", function(req, res){
  var newSong = req.body.song
  Song.create(newSong, function(err, ne){
    if(err){
      res.send("error")
    }
    else{
      res.redirect("/indexsongs")
    }
  })
})

//SONG index
app.get("/indexsongs", function(req,res){
  Song.find({}, function(err, allsongs){
    if(err){
      res.send("error")
    }
    else{
      res.render("songs/indexsongs", {allsongs: allsongs})
    }
  })
})

//SONG - show
app.get("/showsong/:id", function(req,res){
  Song.findById(req.params.id, function(err1, showedsong){
    if(showedsong.series){
     Song.find({singer: showedsong.singer}, function(err2, seriessongs){
       if((err1)||(err2)){
         res.send("err")
       }else{
        res.render("songs/showsong", {showedsong: showedsong, seriessongs:seriessongs})
      }
     })
    }
    else{
      if(err1){
        res.send("err")
      }else{
        res.render("songs/showsong", {showedsong: showedsong})
      }
    }
  })
})


//SONG - edit
app.get("/editsong/:id", function(req,res){
  Song.findById(req.params.id, function(err, editit){
    if(err){
      res.send("err")
    }
    else{
      res.render("songs/editsong", {editit: editit})
    }
  })


})



//SONG update
app.put("/updatesong/:id", function(req, res){
  var updatedSong = req.body.song
  Song.findByIdAndUpdate(req.params.id, updatedSong, function(err, updated){
    if(err){
      res.send("err")
    } else{
      res.redirect("/indexsongs")
    }
  })
})

//SONG delete
app.delete("/deletesong/:id", function(req, res){
  Song.findByIdAndRemove(req.params.id, function(err){
    if (err){
      res.send("err")
    } else{
      res.redirect("/indexsongs")
    }
  })
})

// SONGS SEARCH
app.post("/searchsong", function(req, res){
  var searchinput = req.body.searchinput
  var songssresults = []
  Song.find({}, function(err, searchsongs){
    if (err){
      res.send("err")
    } else{
      searchsongs.forEach(function(song){
        if(song.name.includes(searchinput) || song.singer.includes(searchinput) ){
          songssresults.push(song)
        }
      })
      res.render("songs/searchpage", {searchinput: searchinput, songssresults:songssresults})
    }
  })

})

//מתכונים
var fo = new mon.Schema ({
  name: String,
  img: String,
  state: String,
  catagory: String,
  ingridiants: String,
  making: String
})

var Food = mon.model("Food", fo)

//FOOD create routes - get amd post
app.get("/foodCreate", function(req,res){
  res.render("foods/createFoods")
})

app.post("/foodCr", function(req, res){
  var newFood = req.body.food
  Food.create(newFood, function(err, ne){
    if(err){
      res.send ("error")
    }
    else{
      res.redirect("/צהריים")
    }
  })
})

//FOOD delete
app.delete("/deleteFood/:id", function(req,res){
  var id = req.params.id
  Food.findByIdAndDelete(id, function(err){
    if(err){
      res.send("error")
    }
    else{
      res.redirect("/צהריים")
    }
  })
})
//FOOD index
app.get("/:indexFoods", function(req,res){
  var indexfoods = req.params.indexFoods
  Food.find({catagory:indexfoods }, function(err, foods){
    if (err){
      res.send("error")
    }
    else{
      res.render("foods/indexFoods", {foods: foods, indexfoods:indexfoods })
    }
  })
})

//FOOD edit
app.get("/editFood/:id", function(req,res){
  var id = req.params.id
  Food.findById(id, function(err, editF){
    if(err){
      res.send("error")
    }
    else{
      res.render("foods/editFood", {editF: editF})
    }
  })
})

//FOOD update
app.put("/updateFood/:id", function(req,res){
  var id = req.params.id
  Food.findByIdAndUpdate(id, req.body.food, function(err, updated){
    if(err){
      res.send("error")
    }
    else{
      res.redirect("/צהריים")
    }
  })
})


//FOOD show page 
app.get("/showfood/:id", function(req,res){
  var id = req.params.id
  Food.findById(id, function(err, showedfood){
    if (err){
      res.send("error in the show page")
    }
    else{
      res.render("foods/showFood", {showedfood: showedfood})
    }
  })
})

// FOODS SEARCH
app.post("/searchfood", function(req, res){
  var searchinput = req.body.searchinput
  var foodsresults = []
  Food.find({}, function(err, searchfoods){
    if (err){
      res.send("err")
    } else{
      searchfoods.forEach(function(food){
        if(food.name.includes(searchinput) ){
          foodsresults.push(food)
        }
      })
      res.render("foods/searchpage", {searchinput: searchinput, foodsresults:foodsresults})
    }
  })

})





app.listen(process.env.PORT || 3000, process.env.IP, function () {
  console.log("goodddd");
});
