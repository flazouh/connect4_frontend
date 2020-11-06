function post_request(url, data) {
    console.log(this.constructor.name, 'request_move()')
    console.log("Sending data : to ")
    console.log(`Sending data : to  ${url} `)
    data = JSON.stringify(data)
    console.log(data)
    return fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: data
    })
        .then(response => response.json())
        .then(function (response) {
            return response;
        })
        .catch(function (error) {
            console.log(error);
        });
}