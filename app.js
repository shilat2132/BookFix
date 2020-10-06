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

// ROUTES for orders
// dbs orders collections
// var or = new mon.Schema({
//   name: String,
//   phone: String,
//   address: String,
//   // book: String,
//   created: { type: Date, default: Date.now },
// });

// var Order = mon.model("Order", or);
// // index page of all the orders
// app.get("/shenip/orders", function (req, res) {
//   Order.find({}, function (err, arrOrders) {
//     if (err) {
//       res.send("error");
//     } else {
//       res.render("ordersMe", { ors: arrOrders });
//     }
//   });
// });
// //create an order
// //get a create order page
// app.get("/orders", function (req, res) {
//   Book.find({}, function (err, arrBooks) {
//     if (err) {
//       res.send("error");
//     } else {
//       res.render("order", { arrBooks: arrBooks });
//     }
//   });
// });

// // create an order
// app.post("/order/or", function (req, res) {
//   var newOrder = req.body.order;
//   Order.create(newOrder, function (err, newO) {
//     if (err) {
//       res.send("error");
//     } else {
//       res.redirect("/");
//     }
//   });
// });

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
// delete order route
app.delete("/shenip/orders/:id", function (req, res) {
  Order.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.send("u didn't manage to delete this order");
    } else {
      res.redirect("/shenip/orders");
    }
  });
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

app.listen(process.env.PORT || 3000, process.env.IP, function () {
  console.log("goodddd");
});
