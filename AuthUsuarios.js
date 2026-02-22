function obtenerUsuarios(){
    let usuarios = localStorage.getItem("usuarios");
    if(usuarios == null){
        return [];
    }
    return JSON.parse(usuarios);
}

function guardarUsuarios(usuarios){
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

function registrar() {
    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;

    if (username === "" || password === "") {
        alert("Las credenciales no pueden ser nulas");
        return;
    }

    let usuarios = obtenerUsuarios();

    // Revisar si ya existe el username
    let existe = usuarios.find(u => u.username === username);
    if (existe) {
        alert("Ese usuario ya existe, te redirigimos al login");
        window.location.href = "login.html";
        return;
    }

    // Crear nuevo usuario con las propiedades correctas
    let usuarioNuevo = {
        username: username,
        password: password
    };

    usuarios.push(usuarioNuevo);
    guardarUsuarios(usuarios);

    alert("Usuario registrado correctamente");
    window.location.href = "login.html";
}


function login() {
    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;

    if (username === "" || password === "") {
        alert("Completa todos los campos");
        return;
    }

    let usuarios = obtenerUsuarios();

    // Buscar usuario por username
    let usuario = usuarios.find(u => u.username === username);

    if (!usuario || usuario.password !== password) {
        alert("Credenciales incorrectas");
        return;
    }

    // Guardar usuario logueado
    localStorage.setItem("usuarioActual", username);
    window.location.href = "index.html";
}
       

function logout(){
    localStorage.removeItem("usuarioActual");
    window.location.href = "login.html";
}