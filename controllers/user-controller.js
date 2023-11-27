const { User, Thought } = require('../models');

const userController = {
  // Get all users
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
      .then((userData) => res.json(userData))
      .catch((err) => res.status(500).json(err));
  },

  // Get a single user by ID with populated thought and friend data
  getUserById(req, res) {
    User.findById(req.params.id)
      .populate({
        path: 'thoughts',
        select: '-__v'
      })
      .populate({
        path: 'friends',
        select: '-__v'
      })
      .select('-__v')
      .then((userData) => {
        if (!userData) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json(userData);
      })
      .catch((err) => res.status(500).json(err));
  },

  // Create a new user
  createUser(req, res) {
    User.create(req.body)
      .then((newUser) => res.json(newUser))
      .catch((err) => res.status(500).json(err));
  },

  // Update a user by ID
  updateUser(req, res) {
    User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .then((updatedUser) => {
        if (!updatedUser) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json(updatedUser);
      })
      .catch((err) => res.status(500).json(err));
  },

  // Delete a user by ID
  deleteUser(req, res) {
    User.findByIdAndDelete(req.params.id)
      .then(async (deletedUser) => {
        if (!deletedUser) {
          return res.status(404).json({ message: 'User not found' });
        }

        // Remove the user's associated thoughts
        await Thought.deleteMany({ username: deletedUser.username });

        res.json({ message: 'User and associated thoughts deleted' });
      })
      .catch((err) => res.status(500).json(err));
  },

  // Add a new friend to a user's friend list
  addFriend(req, res) {
    User.findByIdAndUpdate(
      req.params.userId,
      { $push: { friends: req.params.friendId } },
      { new: true, runValidators: true }
    )
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
      })
      .catch((err) => res.status(500).json(err));
  },

  // Remove a friend from a user's friend list
  removeFriend(req, res) {
    User.findByIdAndUpdate(
      req.params.userId,
      { $pull: { friends: req.params.friendId } },
      { new: true, runValidators: true }
    )
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
      })
      .catch((err) => res.status(500).json(err));
  },
};

module.exports = userController;

