//mongoose code to connect to mongodb and create a schema that takes _id as a foreign key from the users tables and also takes a movieId that is not a key
// Path: models/favourites.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface FavouriteDocument extends Document {
  user: mongoose.Types.ObjectId;
  movieId: number;
}

const FavouriteSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    movieId: {
      type: Number,
      required: true,
    },
  }
);

export const Favourite = mongoose.models.Favourite || mongoose.model<FavouriteDocument>('Favourite', FavouriteSchema);
