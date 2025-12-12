const mongoose = require("mongoose");
const Product = require("./product");
const { Schema } = mongoose;

const farmSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
    },
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    ]
})

farmSchema.post('findOneAndDelete', async function (data) {
    if (data.products.length) {
        const res = await Product.deleteMany({ _id: { $in: data.products } })
    }
})

const Farm = mongoose.model("Farm", farmSchema);

module.exports = Farm;