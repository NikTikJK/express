// API documentation

default value port =  3000

перед началом работы надо настроить транспортер писем в index.js

GET запросы 

http://localhost:port/ - возращает строку "Express сервер для ХИМЛАБ"

http://localhost:port/product - возращает каталог товар в виде JSON, возможно укзание параметьров сортировки в запросе
параметры сортировки:
{
    minPrice,
    maxPrice,
    material,
    category,
    brands,
    minWeight,
    maxWeight,
    lang, en/ru
}
JSON obj:
[
     {
      id:1,
      product: "Центрифуга",
      description: "Leica DM500",
      produced: "Германия",
      weight: 6,
      price: 97000,
      material:"Сталь",
      category:'Анализ',
      quantity:1,
      brands:"Flottweg"
    },
    ...    
]
пример запроса:
fetch('http://localhost:3000/product?lang=en')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
    })
    .then(data => {
        console.log(data); 
    })
    .catch(error => {
        console.error('Ошибка:', error);
    });



http://localhost:port/search - возвращает отсортированный набор товаров в формате JSON, указание параметров в запросе
параметры поиска:
{
    lang, en/ru
    q
}
JSON obj:
[
    {
        product: "Центрифуга",
        description: "Leica DM500"
    },
    ...
]
пример запроса:
fetch('http://localhost:3000/search?q=нано')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
    })
    .then(data => {
        console.log(data); 
    })
    .catch(error => {
        console.error('Ошибка:', error);
    });


http://localhost:port/cart/:userId - возвращает карзину с идентификатором пользователя в формате JSON, возможно указания языка в запросе
параметры:
{
    lang - ru/en
}
JSON obj:
[
    {
        id:1,
      product: "Центрифуга",
      description: "Leica DM500",
      produced: "Германия",
      weight: 6,
      price: 97000,
      material:"Сталь",
      category:'Анализ',
      quantity:1,
      brands:"Flottweg"
    },
    ...
]
пример запроса:
fetch('http://localhost:3000/cart/1')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
    })
    .then(data => {
        console.log(data); 
    })
    .catch(error => {
        console.error('Ошибка:', error);
    });


POST запросы

http://localhost:port/cart/:userId - запрос на помещение товара в карзину пользователя 
тело запроса:
{
    id - id товара из запроса http://localhost:port/product
}
пример запроса:
fetch('http://localhost:3000/cart/1/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        id: 1
    })
})
    .then(response => {
        if (response.ok) {
            return console.log(response); 
        }
        throw new Error('Network response was not ok.');
    })
    .catch(error => {
        console.error('Ошибка:', error);
    });
ответ:
    200 - хорошо
    404 - товар не найдена



http://localhost:port/request - запроса на обрантую связь, при успешном выполнении отправляет заявку на почту указанную в index.js
тело запроса:
{
    name,
    phone,
    email
}
пример запроса:
fetch('http://localhost:3000/request', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        name: 'Name',
        phone: '8999999999',
        email: 'test@test.com',
    })
})
    .then(response => {
        if (response.ok) {
            return console.log(response); // Получаем ответ в формате JSON
        }
        throw new Error('Network response was not ok.');
    })
    .catch(error => {
        console.error('Ошибка:', error);
    });
ответ:
    200 - успешно
    500 - Ошибка


http://localhost:port/cart/:userId/buy - запрос на оформление покупки товаров из корзины, при успешном выполнение отправляет заявку на почту указанную в index.js
тело запроса:
{
    fullname, - ФИО
    phone,
    email,
    deliverymethod,  - "доставка"/"самовывоз"
    addres,
    index,
    comment
}
пример запроса:
fetch('http://localhost:3000/cart/1/buy', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        fullname: 'Name Test Test',
        phone: '8999999999',
        email: 'test@test.com',
        deliverymethod: 'доставка',
        addres: 'адрес ул Пушкина',
        index: 'testindex',
        comment: 'comm'
    })
})
    .then(response => {
        if (response.ok) {
            return console.log(response); // Получаем ответ в формате JSON
        }
        throw new Error('Network response was not ok.');
    })
    .catch(error => {
        console.error('Ошибка:', error);
    });
ответ: 
    200 - успешно
    500 - ошибка
