import mongoose from 'mongoose';

const FavouriteSchema = new mongoose.Schema(
  {
    value:{
        type:Number,
        require:0,
    },
    content: {
      type: String,
      required: true,
    },
    attachments: {
      type: Array,
      default: [],
    },
    to_userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    from_userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

FavouriteSchema.statics.findByUser = async function (userId) {
  return this.find({ $or: [{ to_userid: userId }, { from_userid: userId }] });
};

const Favourite = mongoose.model('Favourite', FavouriteSchema);
export default Favourite;
