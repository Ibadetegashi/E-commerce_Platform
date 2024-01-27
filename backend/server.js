const express = require('express')
const app = express();
const userRouter = require('./routers/user.js')
const productRouter = require('./routers/product.js')
const categoryRouter = require('./routers/category.js')
const orderRouter = require('./routers/order.js')
const cartRouter = require('./routers/cart.js')
const cors = require('cors')
const path = require('path')
require('dotenv').config();


//Middlewares
app.use(cors())
app.use(express.json());

app.use('/public/images', express.static(path.join(__dirname, 'public/images')));

//Routes
app.use('/user', userRouter)
app.use('/product', productRouter)
app.use('/category', categoryRouter)
app.use('/order', orderRouter)
app.use('/cart', cartRouter)


app.get('/', (req, res) => {
    res.send('Ibadete Gashi')
})



app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})