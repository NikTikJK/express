

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