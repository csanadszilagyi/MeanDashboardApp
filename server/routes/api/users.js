const express = require('express');
const router = express.Router();
const User = require('../../models/user');

// const _ = require('lodash');

const mapUser = (user) => {
    return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
    };
}

router.get('/all', (req, res, next) => {
   
    User.find()
        .then((users) => {
            const mappedUsers = users.map(user => mapUser(user));
            return res
                .status(200)
                .json({data: mappedUsers})
        })
        .catch(error => {
            next(error);
        });
});

router.get('', (req, res, next) => {
    let currentPage = +req.query.page || 1;

    if (currentPage < 1) {
        currentPage = 1;
    }

    const perPage = +req.query.count || 10;
    const from = (currentPage - 1) * perPage;
    // const to = from + perPage;

    User.countDocuments({})
        .then((count) => {
            if (count > from) {
                const lastPage = Math.ceil(count / perPage);
                User.find()
                    .skip(from)
                    .limit(perPage)
                    .then(users => {
                        const mappedUsers = users.map(user => mapUser(user));
                        return res
                            .status(200)
                            .json({
                                data: mappedUsers,
                                meta: {
                                    total: count,
                                    numItems: mappedUsers.length, // can be smaller than perPage, if we are on the lastPage
                                    from: from + 1,
                                    to: from + mappedUsers.length,
                                    perPage,
                                    currentPage,
                                    lastPage
                                }
                            });
                    })
                    .catch(error => {
                        next(error);
                    });
            }
            else {
                return res
                    .status(400)
                    .json({
                        data: {
                            message: 'The requested chunk of the collection can not be returned.'
                        }
                    });
            }
        })
        .catch(error => {
            next(error);
        });
});



router.put('/:id', async (req, res, next) => {

    const id = req.params.id.toString();
    const body = req.body.data.attributes;

    const update = {...body};
    const user = await User.findByIdAndUpdate(id, update);

    if (user) {
        user.update()
        return res.status(200).json({
            data: {
                type: 'users',
                id: user.id,
                attributes: {
                    changedProps: body
                }
            }
        });
    }

    /*
    let id = +req.params.id;
    let user = _.find(userdb.users, user => user.id === id);

    if(user) {

        let changedProps = {};
        _.forIn(req.body.attributes, (value, key) => {
            if(_.has(user, key)) {
                user[key] = value;
                changedProps[key] = value;
            }
        });

        res.status(200).json({data: {
                type: 'users',
                id: user.id,
                attributes: changedProps
            }
        });
        next();
    }
    */
    return res.status(404).json({
        data: {},
        errors: {
            //id: id,
            title: 'User was not found.',
            status: 404
        }
    });

});

router.get('/:id', async (req, res, next) => {

    const id = req.params.id.toString();

    const user = await User.findById(id);

    if (user) {
        return res.status(200).json({
            data: {
                type: 'users',
                id: user.id,
                attributes: mapUser(user)
            }
        });
    }
    
    return res.status(404).json({
        data: {},
        errors: {
            //id: id,
            title: 'User was not found.',
            status: 404
        }
    });
});

module.exports = router;