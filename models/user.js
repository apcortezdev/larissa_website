import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const user = new Schema({
  email: {
    type: String,
    required: true,
  },
  hashPassword: {
    type: String,
    required: true,
  },
  lastActive: {
    type: Date,
    default: new Date(),
  },
});

user.query.byEmail = function (email) {
  return this.where({ email: email, active: true });
};

export default mongoose.models.User || mongoose.model('User', user);
