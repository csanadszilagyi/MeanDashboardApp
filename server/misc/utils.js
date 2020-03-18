const createCookieList = reqHeaderCookieStr => {

    let list = {};
    reqHeaderCookieStr && reqHeaderCookieStr.split(';').forEach(function( cookie ) {
        let parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });
    return list;
}

function errorHandler(err, req, res, next) {
    if (typeof (err) === 'string') {
        // custom application error
        return res.status(400).json({ message: err });
    }

    if (err.name === 'ValidationError') {
        // mongoose validation error
        return res.status(400).json({ message: err.message });
    }

    if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        return res.status(401).json({ message: 'Invalid Token' });
    }

    // default to 500 server error
    return res.status(500).json({ message: err.message });
}

function getPaginatedCollection(Model, page, perPage, query) {

    if (page < 1) {
        page = 1;
    }

    const from = (page - 1) * perPage;
    // const to = from + perPage;
    const ask = query || {};
    console.log(ask);
    return new Promise((resolve, reject) => {
        Model.countDocuments(ask)
            .then((count) => {
                if (count > from) {
                    const lastPage = Math.ceil(count / perPage);
                    Model.find()
                        .skip(from)
                        .limit(perPage)
                        .then(users => {
                            resolve({
                                data: users, 
                                meta: {
                                    total: count,
                                    numItems: users.length, // can be smaller than perPage, if we are on the lastPage
                                    from: from + 1,
                                    to: from + users.length,
                                    perPage,
                                    currentPage: page,
                                    lastPage
                                }
                            });  
                        })
                        .catch(error => reject(error));
                }
                else {
                    reject('The requested chunk of collection can not be returned.');
                }
            })
    });
}
module.exports = {
    createCookieList,
    errorHandler,
    getPaginatedCollection
};
