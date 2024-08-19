import express from "express";
import { productsRUS, productsENG } from "./product-data.js";
import nodemailer  from 'nodemailer'
import bodyParser from "body-parser";
import { cartENG, cartRUS } from "./cart-data.js";
import session from "express-session";

const app = express();
const port = 3000;
const user = "nsahov@internet.ru" //адрес почты с которой будет происходить отправка писем
const transporter = nodemailer.createTransport({
  host: "smtp.mail.ru",
  port: 465,
  secure: true,
  auth: {
    user: user, 
    pass: '' //пароль для внешнего приложения вашей посты
  }
})


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'mySecretKey',
  resave: false,
  saveUninitialized: true
}));

app.get("/", (req, res) => {
  res.send("Express сервер для ХИМЛАБ");
});

app.get("/product", (req, res) => {
  const {
    minPrice,
    maxPrice,
    material,
    category,
    brands,
    minWeight,
    maxWeight,
    lang,
  } = req.query;

  let products;

  if (lang) {
    if (lang.toLowerCase() === "en") {
      products = productsENG;
    } else {
      products = productsRUS;
    }
  } else {
    products = productsRUS;
  }

  let filteredProducts = products;

  if (category) {
    filteredProducts = filteredProducts.filter(
      (product) => product.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (brands) {
    filteredProducts = filteredProducts.filter(
      (product) => product.brands.toLowerCase() === brands.toLowerCase()
    );
  }

  if (material) {
    filteredProducts = filteredProducts.filter(
      (product) => product.material.toLowerCase() === material.toLowerCase()
    );
  }

  if (minPrice && maxPrice) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.price >= parseInt(minPrice) &&
        product.price <= parseInt(maxPrice)
    );
  }

  if (minWeight && maxWeight) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.weight >= parseInt(minWeight) &&
        product.weight <= parseInt(maxWeight)
    );
  }

  res.json(filteredProducts);
});

app.get("/search", (req, res) => {
  const { q, lang } = req.query;
  let products;

  if (lang) {
    if (lang.toLowerCase() === "en") {
      products = productsENG;
    } else {
      products = productsRUS;
    }
  } else {
    products = productsRUS;
  }  

  let filteredProducts = products;


  if (q) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.product &&
        product.product.toLowerCase().includes(q.toLowerCase())
    );
    const simplifiedProducts = filteredProducts.map(
      ({ product, description }) => ({ product, description })
    );
    res.json(simplifiedProducts);
  } else {
    res.json(
      filteredProducts.map(({ product, description }) => ({ product, description }))
    );
  }
});


app.use((req, res, next) => {
    req.requestTime = Date.now();
    next();
  });

app.post('/request',async (req, res) => {
    const {name, phone, email} = req.body
    const requestTime = req.requestTime;
    
      try {

        await transporter.sendMail({
          from: user,
          to: user,
          subject: 'Заявка на обратную связь',
          text: `${name} ${phone} ${email} ${new Date(requestTime)} `
        })
        
        res.status(200).send({
          status: 200,
          message: 'успешно'
        })

      }catch (error) {
        res.status(500).send({
          status: 500,
          message: 'ошибка'
        })
      }
})


app.get('/cart/:userId', (req, res) => {
  const {lang} = req.query
  const userId = req.params.userId

  let cart;

  if (!cartENG[userId] && !cartRUS[userId]) {
    cartENG[userId] = []
    cartRUS[userId] = []
  }

  if (lang) {
    if (lang.toLowerCase() === "en") {
      cart = cartENG[userId];
    } else {
      cart = cartRUS[userId];
    }
  } else {
    cart = cartRUS[userId];
  }  

  res.json(cart)
})


app.post('/cart/:userId', (req, res) => {
  const {id} = req.body
  const userId = req.params.userId
  

  if (!cartENG[userId] && !cartRUS[userId]) {
    cartENG[userId] = [];
    cartRUS[userId] = [];
  } 

  if (id) {
      cartENG[userId].push(productsENG.filter(product => product.id === parseInt(id)))
      cartRUS[userId].push(productsRUS.filter(product => product.id === parseInt(id)))
      res.status(200).send('добавлено в корзину')
  }else {
    res.status(404).send('карточка не найдена')
  }

})

app.post('/cart/:userId/buy',async (req, res) => {
  const {fullname, phone, email, deliverymethod, addres, index, comment} = req.body
  const requestTime = req.requestTime;
  const userId = req.params.userId
  console.log(req.body);
  
  let deliverInformation;
  const userCart = cartRUS[userId]

  console.log(userCart);
  
  if (deliverymethod.toLowerCase() === 'доставка') {
    deliverInformation = `способ доставки: доставка, адрес: ${addres}, индекс: ${index}` 
  }else {
    deliverInformation = "способ доставки: самовывоз"
  }

  try {

    await transporter.sendMail({
      from: user,
      to: user,
      subject: 'Заявка на покупку',
      text: `Время заявкм: ${new Date(requestTime)},
      Контактное лицо: ${fullname} ${phone} ${email},
      ${deliverInformation} ,
      заказ: ${userCart},
      коментарий: ${comment}
      `
    })
    
    cartENG[userId] = []
    cartRUS[userId] = []

    res.status(200).send({
      status: 200,
      message: 'успешно'
    })

  }catch (error) {
    res.status(500).send({
      status: 500,
      message: 'ошибка'
    })
  }

  
})


app.listen(port, () => {
  console.log(`Сервер запущен на порту http://localhost:${port}`);
});
