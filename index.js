const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
var methodOverride = require("method-override");

const Product = require("./model/product");

mongoose
  .connect("mongodb://127.0.0.1:27017/farmStand", { useNewUrlParser: true })
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

const categories = ['vegetables','fruits','dairy','bakery'];

app.get("/products", async (req, res) => {
  const products = await Product.find({});
  console.log("Product data ==>", products);
  //res.send("All product will show here");
  res.render("products/index", { products });
});

app.get("/products/new", (req, res) => {
  //res.send("Form to create new product will show here");
  res.render("products/new",{categories});
});

app.post("/products", async (req, res) => {
  console.log("Request Body==>", req.body);
  const newProduct = new Product(req.body);
  await newProduct.save();
  console.log("New Product added==>", newProduct);
  //res.send("New product added");
  res.redirect(`/products/${newProduct._id}`);
});

app.get("/products/:id/edit", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  console.log("Edit Product data==>", product);
  //res.send("Edit form will show here");
  res.render("products/edit", { product, categories });
});

app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  console.log("Single Product data==>", product);
  //res.send("Single product will show here");
  res.render("products/show", { product });
});

app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  const detedProduct = await Product.findByIdAndDelete(id)
  console.log("Deleted Product data==>", detedProduct);
  //res.send("Delete Route");
  res.redirect("/products");

});

app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
  console.log("Updated request body======>", req.body);
  // res.send("Update Route");
  res.redirect(`/products/${product._id}`);
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
