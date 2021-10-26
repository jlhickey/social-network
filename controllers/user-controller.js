const { User, Thought } = require('../models')

const userController = {
    
   // get all users
   getAllUsers(req, res) {
       User.find({})
       .populate({
        path: 'thoughts',
        select: '-__v'
        })
        .populate({
            path: 'friends',
            select: '-__v'
        })
        .select('-__v')
       .then(dbUserData => res.json(dbUserData))
       .catch(err => {
        console.log(err);   
        res.status(400).json(err)
       });
   },

    // get one user by id and populate thought and friend data
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .populate({
            path: 'friends',
            select: '-__v'
        })
        .select('-__v')
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user with this id!'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);   
            res.status(400).json(err)
        });
    },
    
    // create new user
    createUser({ body }, res) {
        User.create(body)
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.status(400).json(err));
    },

    // update user by id
    updateUser({ params, body}, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user with that id!'});
                    return;
                }
                res.json(dbUserData);
            })
        .catch(err => res.status(400).json(err));
    },

    //  delete user
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
            .then(deletedUser => {
                if (!deletedUser) {
                    res.status(404).json({ message: 'No user with this id!' });
                    return;
                }
                return deletedUser;
                // res.json(deletedUser);
            })
            .then(deletedUser => {
                Thought.deleteMany(
                    { username: deletedUser.username})
                    .then(() => {
                        res.json({ message: 'User and associated thoughts successfully deleted!' })
                    })
                    .catch(err => res.status(400).json(err));
            })
            .catch(err => res.status(400).json(err));
        },   
    
    // add friend
    addFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.id },
            { $push: {friends: params.friendId}},
            {new: true, runValidators: true})
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user with that id!'});
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err));
    },

    // remove friend
    removeFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.id },
            { $pull: {friends: params.friendId}},
            {new: true, runValidators:true})
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user with that id!'});
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err));
    }
    
};

module.exports = userController
