const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },

  author: String,
  description: String,
  isbn: String,

  category: String,
  genre: [String],

  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  images: [String],

  condition: {
    type: String,
    enum: ["new", "good", "fair", "poor"],
    default: "good"
  },

  availability: {
    type: String,
    enum: ["available", "borrowed", "unavailable"],
    default: "available"
  },

  stats: {
    timesBorrowed: { type: Number, default: 0 },
    timesSwapped: { type: Number, default: 0 }
  },

  createdAt: { type: Date, default: Date.now }
});
