onst { Thought, User } = require('../models')

const thoughtController = {

    // get all thoughts
    getAllThoughts(req, res) {
        Thought.find({})
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
        console.log(err);   
        res.status(400).json(err)
       });
    },

    // get thought by Id
    getThoughtById({ params }, res) {
        Thought.findOne({ _id : params.id })
        .select('-__v')
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought with this id!'});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => {
            console.log(err);   
            res.status(400).json(err)
        });
    },

    // create thought
    createThought({ params, body }, res) {
        Thought.create(body)
        .then(({ _id }) => {
            return User.findOneAndUpdate(
                { _id: params.userId},
                { $push: { thoughts: _id } },
                { new: true, runValidators: true }
            );
        })
        .then(dbUserData => {
            if (!dbUserData) {
              res.status(404).json({ message: 'No user found with this id!' });
              return;
            }
            res.json(dbUserData);
          })
        .catch(err => res.json(err));
    },

    //  update thought
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id}, body, { new: true, runValidators: true })
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought with that id!'});
                return;
            }
            res.json(dbThoughtData);
        })
    .catch(err => res.status(400).json(err));
    },

    //  delete thought
    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
            .then(deletedThought => {
                if (!deletedThought) {
                    res.status(404).json({ message: 'No thought with this id!' });
                    return;
                }
                res.json(deletedThought);
            })
            .catch(err => res.status(400).json(err));
        },

    // post a reaction
    postReaction({ params, body}, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body}},
            { new: true, runValidators: true })
            .select('-__v')
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought with this id!' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.status(400).json(err));  
    },

    // delete a reaction
    deleteReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId }}},
            { new: true })
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => res.status(400).json(err));  
    },

}

module.exports = thoughtController;
