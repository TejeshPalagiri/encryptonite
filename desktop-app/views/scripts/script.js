const urlPatteren = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/
let server = "";
let appHost= location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');;
// HTTP Requests
const get = (url, params) => {
    return new Promise(async (resolve, reject) => {
        try {
            const options = {
                method: "GET",
                headers: {
                  "Content-Type": "application/json"
                },
            };
            if(!_.isEmpty(params)) {
                url = `${url}?`;
                _.forEach(params, (value, key) => {
                    url += `${key}=${value}&`
                })
            }
            const req = await fetch(url, options)
            const response = await req.json();
            if(req.ok) {
                resolve(response);
            } else {
                reject(response);
            }
        } catch (error) {
            console.error(error);
            reject(error);
        }
    })
}

const post = (url, payload, params) => {
    return new Promise(async (resolve, reject) => {
        try {
            const options = {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: payload
            };
            if(!_.isEmpty(params)) {
                url = `${url}?`;
                _.forEach(params, (value, key) => {
                    url += `${key}=${value}&`
                })
            }
            
            const req = await fetch(url, options)
            const response = await req.json();
            if(req.ok) {
                resolve(response);
            } else {
                reject(response);
            }
        } catch (error) {
            console.error(error);
            reject(error);
        }
    })
}

const put = (url, payload, params) => {
    return new Promise(async (resolve, reject) => {
        try {
            const options = {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json"
                },
                body: payload
            };
            if(!_.isEmpty(params)) {
                url = `${url}?`;
                _.forEach(params, (value, key) => {
                    url += `${key}=${value}&`
                })
            }
            
            const req = await fetch(url, options)
            const response = await req.json();
            if(req.ok) {
                resolve(response);
            } else {
                reject(response);
            }
        } catch (error) {
            console.error(error);
            reject(error);
        }
    })
}

const del = (url, params) => {
    return new Promise(async (resolve, reject) => {
        try {
            const options = {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json"
                }
            };
            if(!_.isEmpty(params)) {
                url = `${url}?`;
                _.forEach(params, (value, key) => {
                    url += `${key}=${value}&`
                })
            }
            
            const req = await fetch(url, options)
            const response = await req.json();
            if(req.ok) {
                resolve(response);
            } else {
                reject(response);
            }
        } catch (error) {
            console.error(error);
            reject(error);
        }
    })
}

// Core Scripts
const pingServer = (url) => {
    return get(url);
}

const login = (url, payload) => {
    return post(url, payload);
}




const onPing = async (event) => {
    try {
        event.preventDefault();
        const urlValue = document.getElementById("url").value;
        let error = document.getElementById('error');
        let validation = document.getElementById('validation');
        let success = document.getElementById('success');
        
        if(!urlValue || !urlPatteren.test(urlValue)) {
            validation.style.display = 'block';
            return;
        }
        
        const response = await pingServer(urlValue);
        if(response['success']) {
            success.style.display = 'block';
            localStorage.setItem('server', urlValue);
            server = urlValue;
            window.location.href = appHost + '/login.html'
        } else {
            error.style.display = 'block';
            localStorage.removeItem('server');
        }
    } catch (error) {
        let e = document.getElementById('error');
        e.style.display = 'block';
        console.error(error);
        localStorage.removeItem('server');
    }
    
}

const onValueChange = (event) => {
    // event.preventDefault();

    let error = document.getElementById('error');
    let validation = document.getElementById('validation');
    let success = document.getElementById('success');

    error.style.display = 'none';
    validation.style.display = 'none';
    success.style.display = 'none';
}

const onChangeServer = (evet) => {
    localStorage.clear();
    window.location.href = '/';
}


const main = () => {
    let s = localStorage.getItem('server');
    let currentPathLocation = window.location.pathname;
    if((currentPathLocation === "/" || currentPathLocation === "/index.html") && s) {
        server = s;
        window.location.href = appHost + '/login.html'
    } else if(currentPathLocation === '/login.html') {
        console.log('Login page');
    }
}

main();