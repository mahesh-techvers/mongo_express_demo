const mongoose = require("mongoose");

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

// const p = new Product({
//   name: "Mango",
//   price: 2.49,
//   category: "fruits",
// });

// p.save().then((data) => {
//   console.log("Saved data====>", data);
// }).catch((err) => {
//   console.log("Error saving data====>", err);
// });

const seedProducts = [
  {
    name: "Apple",
    price: 1.99,
    category: "fruits",
  },
  {
    name: "Banana",
    price: 0.99,
    category: "fruits",
  },
  {
    name: "Carrot",
    price: 0.79,
    category: "vegetables",
  },
  {
    name: "Broccoli",
    price: 1.29,
    category: "vegetables",
  },
  {
    name: "Milk",
    price: 2.49,
    category: "dairy",
  },
  {
    name: "Cheese",
    price: 3.99,
    category: "dairy",
  },
  {
    name: "Bread",
    price: 2.99,
    category: "bakery",
  },
  {
    name: "Croissant",
    price: 1.49,
    category: "bakery",
  },
];

Product.insertMany(seedProducts)
  .then((res) => {
    console.log("Inserted products:", res);
  })
  .catch((err) => {
    console.log("Error inserting products:", err);
  });  
