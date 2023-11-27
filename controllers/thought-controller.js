const { Thought, User } = require('../models');

const thoughtController = {
  // Get all thoughts
  getAllThoughts(req, res) {
    Thought.find({})
      .select('-__v')
      .then((thoughtData) => res.json(thoughtData))
      .catch((err) => res.status(500).json(err));
  },

  // Get a single thought by ID
  getThoughtById(req, res) {
    Thought.findById(req.params.id)
      .select('-__v')
      .then((thoughtData) => {
        if (!thoughtData) {
          return res.status(404).json({ message: 'Thought not found' });
        }
        res.json(thoughtData);
      })
      .catch((err) => res.status(500).json(err));
  },

  // Create a new thought
  createThought(req, res) {
    Thought.create(req.body)
      .then((newThought) => {
        // Push the created thought's _id to the associated user's thoughts array field
        return User.findByIdAndUpdate(
          req.body.userId,
          { $push: { thoughts: newThought._id } },
          { new: true, runValidators: true }
        );
      })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
      })
      .catch((err) => res.status(500).json(err));
  },

  // Update a thought by ID
  updateThought(req, res) {
    Thought.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .then((updatedThought) => {
        if (!updatedThought) {
          return res.status(404).json({ message: 'Thought not found' });
        }
        res.json(updatedThought);
      })
      .catch((err) => res.status(500).json(err));
  },

  // Delete a thought by ID
  deleteThought(req, res) {
    Thought.findByIdAndDelete(req.params.id)
      .then((deletedThought) => {
        if (!deletedThought) {
          return res.status(404).json({ message: 'Thought not found' });
        }

        // Remove the thought from the associated user's thoughts array
        return User.findByIdAndUpdate(
          deletedThought.userId,
          { $pull: { thoughts: req.params.id } },
          { new: true, runValidators: true }
        );
      })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'Thought and associated user data updated' });
      })
      .catch((err) => res.status(500).json(err));
  },

  // Create a reaction stored in a single thought's reactions array field
  addReaction(req, res) {
    Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $push: { reactions: req.body } },
      { new: true, runValidators: true }
    )
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({ message: 'Thought not found' });
        }
        res.json(thought);
      })
      .catch((err) => res.status(500).json(err));
  },

  // Pull and remove a reaction by the reaction's reactionId value
  removeReaction(req, res) {
    Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { new: true, runValidators: true }
    )
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({ message: 'Thought not found' });
        }
        res.json(thought);
      })
      .catch((err) => res.status(500).json(err));
  },
};

module.exports = thoughtController;

