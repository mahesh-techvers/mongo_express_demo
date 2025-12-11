const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const AppError = require("./AppError");
var methodOverride = require("method-override");

const Product = require("./model/product");
const Farm = require("./model/farm");

mongoose
  .connect("mongodb://127.0.0.1:27017/farmStand2", { useNewUrlParser: true })
  .then(() => {
    console.log("Mongo Database connected successfully");
  })
  .catch((err) => {
    console.log("Mongo Database connection failed");
    console.log(err);
  });

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

//FARM ROUTES
app.get("/farms", async (req, res) => {
  const farms = await Farm.find({})
  res.render("farms/index", { farms })
});

app.get("/farms/new", (req, res) => {
  res.render("farms/new")
})

app.get("/farms/:id", async (req, res) => {
  const id = req.params.id;
  const farm = await Farm.findById(id).populate("products");
  console.log("Farm data ==>", farm);
  const products = farm.products;
  console.log("Products data ==>", products);
  res.render("farms/show", { farm, products });
});

app.post('/farms', async (req, res) => {
  // res.send(req.body)
  const farm = new Farm(req.body)
  await farm.save()
  res.redirect(`/farms`)
})

app.get('/farms/:id/products/new', async (req, res) => {
  const { id } = req.params;
  const farm = await Farm.findById(id);
  res.render("products/new", { categories, farm });
})

app.post('/farms/:id/products', async (req, res) => {
  const { id } = req.params;
  const farm = await Farm.findById(id);
  const { name, price, category } = req.body;
  const product = new Product({ name, price, category })
  farm.products.push(product)
  product.farm = farm
  await farm.save()
  await product.save()
  res.send(farm);
  //res.send(req.body)
})

//PRODUCT ROUTES

const categories = ["vegetables", "fruits", "dairy", "bakery"];

function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((e) => next(e));
  };
}

app.get(
  "/products",
  wrapAsync(async (req, res, next) => {
    const products = await Product.find({});
    console.log("Product data ==>", products);
    //res.send("All product will show here");
    res.render("products/index", { products });
  })
);

app.get("/products/new", (req, res) => {
  //res.send("Form to create new product will show here");
  res.render("products/new", { categories });
});

app.post(
  "/products",
  wrapAsync(async (req, res, next) => {
    console.log("Request Body==>", req.body);
    const newProduct = new Product(req.body);
    await newProduct.save();
    console.log("New Product added==>", newProduct);
    res.redirect(`/products/${newProduct._id}`);
  })
);

app.get("/products/:id/edit", async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    console.log("Edit Product data==>", product);
    //res.send("Edit form will show here");
    res.render("products/edit", { product, categories });
  } catch (e) {
    next(e);
  }
});

app.get(
  "/products/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      // throw new AppError("The product page is not found",404);
      return next(new AppError("The product page is not found", 404));
    }
    console.log("Single Product data==>", product);
    //res.send("Single product will show here");
    res.render("products/show", { product });
  })
);

app.delete("/products/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const detedProduct = await Product.findByIdAndDelete(id);
    console.log("Deleted Product data==>", detedProduct);
    //res.send("Delete Route");
    res.redirect("/products");
  } catch (e) {
    next(e);
  }
});

app.put("/products/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, {
      runValidators: true,
      new: true,
    });
    console.log("Updated request body======>", req.body);
    // res.send("Update Route");
    res.redirect(`/products/${product._id}`);
  } catch (e) {
    next(e);
  }
});

function handlingErrorFunc(err) {
  console.log("CastError", err)
  return err;
}

app.use((err, req, res, next) => {
  if (err.name = 'CastError') err = handlingErrorFunc(err)
  next(err);
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).send(message);
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
