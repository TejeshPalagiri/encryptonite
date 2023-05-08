const pingServer = (url) => {
    return http.get(url);
}

const login = (url, payload) => {
    return http.post(url, payload);
}

// module.exports = {
//     pingServer,
//     login,
// }