const socket = io();
        const newProduct = {};
        const title = document.getElementById('title');
        const price = document.getElementById('price');
        const thumbnail = document.getElementById('thumbnail');
        const form = document.getElementById('form');
        const results = document.getElementById('results');
        const head = document.getElementById("head");

        const chat = document.getElementById("chat");
        const email = document.getElementById("email");
        const message = document.getElementById("message");
        const chatMessages = document.getElementById("messages");

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if(title.value && price.value && thumbnail.value) {
                newProduct.title = title.value;
                newProduct.price = price.value;
                newProduct.thumbnail = thumbnail.value;

                socket.emit('nuevo producto', newProduct);
                title.value = "";
                price.value = "";
                thumbnail.value = ""; 
            }
            
        });

        const sendData = () => {
            if(email.value && message.value) {
                const chatMessage = {
                    email: email.value,
                    message: message.value,
                };
                socket.emit('nuevo mensaje', chatMessage);
                return;
            } else {
                console.error("Algún campo está vacío");
            }
        }

        chat.addEventListener('submit', (e) => {
            e.preventDefault();
            sendData();
        });

        const paintMessages = (messages) => {
            if(messages) {
                
                const html = messages.map(message => {
                    return (`<div>
                                <strong class="email">${message.email}</strong>
                                <span class="date">${message.datetime}</span>
                                <span class="message">${message.message}</span>
                            </div>`);
                }).join(" ");
                chatMessages.innerHTML = html;
            }  
        } 

        socket.on('messages', (messages) => {
            if(typeof messages === 'object') paintMessages(messages);
            else console.warn(messages);
        })

        socket.on('nuevo producto', (producto) => {
            if(producto) {
            head.innerHTML = `<tr class="text-center">
                            <th scope="col">Title</th>
                            <th scope="col">Price</th>
                            <th scope="col">Thumbnail</th>
                            </tr>`
            
                const tr = document.createElement('tr');
                tr.classList.add('text-center');
            tr.innerHTML = ` <td>${producto.title}</td>
                            <td>${producto.price} €</td>
                            <td><img class="img" src="${producto.thumbnail}"></td>`
            results.appendChild(tr);
            } 
        });

        socket.on('server message', (message) => {
            console.log(message)
        });