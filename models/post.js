const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PostSchema = new Schema({
  user: {
      type: Schema.Types.ObjectId,
      ref: 'UsersRegistrations'
  },
  text: {
      type: String,
      required: true
  },
  name: {
      type: String
  },
  avatar: {
      type: String
  },
  likes: [
      {
    user: {
        type: Schema.Types.ObjectId,
        ref: 'usersRegistrations'
    }
}
  ],
  comments: [
      {
      user: {
          type: Schema.Types.ObjectId,
          ref: 'usersRegistrations'
      },
      text: {
          type: String,
          required: true
      },
      name: {
          type: String
      },
      avatar: {
          type: String
      },
      date: {
          type: Date,
          default: Date.now
      }
    }
  ]  
});
module.exports = post = mongoose.model("Post", PostSchema);