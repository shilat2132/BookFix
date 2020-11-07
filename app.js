var express = require("express");
var app = express();
var mon = require("mongoose");
var bp = require("body-parser");
var me = require("method-override");

mon
  .connect(
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
app.use(express.static("public"));
app.use(bp.urlencoded({ extended: true }));
app.use(me("_method"));

var or = new mon.Schema ({
  name: String,
  phone: Number,
  address: String,
  books: String,
  date: { type: Date, default: Date.now }

})

var Order = mon.model ("Order", or)
//index orders
app.get("/orders/index", function(req, res){
  Order.find({}, function(err, arr){
    if(err){
      res.send("error")
    }
    else{
      res.render("ordersMe", {arr: arr})
    }
  })
})

//post orders
app.post("/:cat/:id/orders", function(req, res){
  var newOrder = req.body.order
  var id = req.params.id
  var cat = req.params.cat

  Order.create(newOrder, function(err, ne){
    if(err){
      res.send("error")
    }
    else{
      res.redirect("/" + cat + "/" + id)
    }
  })
})

// delete order
app.delete("/shenip/orders/:id", function(req, res){
  var id = req.params.id
  Order.findByIdAndDelete(id, function(err){
    if(err){
      res.send("error")
    }
    else{
      res.redirect("/orders/index")
    }
  })
})

//dbs book collection
var bo = new mon.Schema({
  current: String,
  pay: String,
  name: String,
  writer: String,
  img: String,
  price: Number,
  category: String,
  summary: String,
  series: Boolean,
});

var Book = mon.model("Blog", bo);

// ROUTES for books
//home route
app.get("/", function (req, res) {
  res.render("ho");
});

// index route
app.get("/:cat", function (req, res) {
  var cat = req.params.cat;

  Book.find({ current: cat }, function (err, foundCategory) {
    if (err) {
      res.send("there is an eror " + err);
    } else {
      res.render("index", {
        cat: cat,
        catBooks: foundCategory,
      });
    }
  });
});

app.get("/contact/detailes", function (req, res) {
  res.render("contact");
});

//CREATE ROUTES
//get create route
app.get("/:cat/punchie", function (req, res) {
  var cat = req.params.cat;
  res.render("create", { cat: cat });
});
//post create route
app.post("/:cat", function (req, res) {
  var cat = req.params.cat;
  var newBook = req.body.book;
  Book.create(newBook, function (err, newBook) {
    if (err) {
      res.send("there is an error" + err);
    } else {
      res.redirect("/" + cat);
    }
  });
});
//show route
app.get("/:cat/:id", function (req, res) {
  var cat = req.params.cat;
  var id = req.params.id;
  Book.findById(id, function (err, chosenBook) {
    Book.find({ writer: chosenBook.writer }, function (err1, series) {
      if (err || err1) {
        res.send("error");
      } else {
        res.render("show", {
          cat: cat,
          id: id,
          chosenBook: chosenBook,
          ser: series,
        });
      }
    });
  });
});

//search route
app.post("/search/b/book", function (req, res) {
  var s = req.body.s;
  var bo = false;
  Book.find({}, function (err, arrBooks) {
    if (err) {
      res.send("errorrrr");
    } else {
      res.render("searchPage", { arrBooks: arrBooks, s: s, bo: bo });
    }
  });
});

// edit route
app.get("/:cat/:id/nesCaffe", function (req, res) {
  Book.findById(req.params.id, function (err, book) {
    if (err) {
      res.send("there is an error");
    } else {
      res.render("edit", {
        bookE: book,
        cat: req.params.cat,
        id: req.params.id,
      });
    }
  });
});

//update route
app.put("/:cat/:id", function (req, res) {
  Book.findByIdAndUpdate(req.params.id, req.body.book, function (
    err,
    updatedBook
  ) {
    if (err) {
      res.send("there is an error" + err);
    } else {
      res.redirect("/" + req.params.cat + "/" + req.params.id);
    }
  });
});

// delete route
app.delete("/:cat/:id", function (req, res) {
  Book.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.send("u didn't manage to delete this book");
    } else {
      res.redirect("/" + req.params.cat);
    }
  });
});

app.listen(process.env.PORT || 3000, process.env.IP, function () {
  console.log("goodddd");
});
