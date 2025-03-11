const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  genre: { type: String, required: true },
  ratings: [{ userId: mongoose.Schema.Types.ObjectId, rating: Number }],
});

MovieSchema.virtual("averageRating").get(function () {
  if (this.ratings.length === 0) return 0;
  const sum = this.ratings.reduce((acc, r) => acc + r.rating, 0);
  return (sum / this.ratings.length).toFixed(2);
});

module.exports = mongoose.model("Movie", MovieSchema);
