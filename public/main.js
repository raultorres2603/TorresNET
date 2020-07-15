var socket = io.connect('http://localhost:3000', { 'forceNew': true });

socket.on("new-login-insert", function() {
        console.log('new-login with insert');
});

socket.on("new-login-select", function() {
    console.log('new-login with select');
});
