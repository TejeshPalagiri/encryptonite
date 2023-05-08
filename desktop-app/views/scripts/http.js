export const get = (url, params) => {
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

export const post = (url, payload, params) => {
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

export const put = (url, payload, params) => {
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

export const del = (url, params) => {
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

// module.exports = {
//     get,
//     post,
//     put,
//     del
// }