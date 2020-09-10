var express = require("express");
var app = express();
var mon = require("mongoose");
var bp = require("body-parser");
var me = require("method-override");

mon
  .connect("mongodb://localhost:27017/books", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to DB!"))
  .catch((error) => console.log(error.message));

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bp.urlencoded({ extended: true }));
app.use(me("_method"));

// ROUTES for orders
// index page of all the orders
app.get("/shenip/orders", function (req, res) {
  Order.find({}, function (err, arrOrders) {
    if (err) {
      res.send("error");
    } else {
      res.render("ordersMe", { ors: arrOrders });
    }
  });
});
//create an order
//get a create order page
app.get("/:cat/:id/orders", function (req, res) {
  var cat = req.params.cat;
  var id = req.params.id;
  res.render("order", { cat: cat, id: id });
});
// create an order
app.post("/:cat/:id", function (req, res) {
  var cat = req.params.cat;
  var id = req.params.id;
  var newOrder = req.body.order;
  Order.create(newOrder, function (err, newO) {
    if (err) {
      res.send("error");
    } else {
      res.redirect("/" + cat + "/" + id);
    }
  });
});

//dbs book collection
var bo = new mon.Schema({
  current: String,
  name: String,
  writer: String,
  img: String,
  price: String,
  category: String,
  summary: String,
  series: Boolean,
});

var Book = mon.model("Blog", bo);

// ROUTES for books
//home route
app.get("/", function (req, res) {
  res.render("home");
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

// dbs orders collections
var or = new mon.Schema({
  name: String,
  phone: String,
  address: String,
  book: String,
  payment: String,
  created: { type: Date, default: Date.now },
});

var Order = mon.model("Order", or);

app.listen(process.env.PORT || 3000, process.env.IP, function () {
  console.log("goodddd");
});
