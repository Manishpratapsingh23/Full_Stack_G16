import mongoose from "mongoose";

const ownerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  booksOwned: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Book" }
  ],

  totalBorrowsApproved: { type: Number, default: 0 },
  totalBorrowsRejected: { type: Number, default: 0 },

  swapHistory: [
    {
      bookGiven: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
      bookReceived: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
      swappedWith: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      date: { type: Date, default: Date.now }
    }
  ],

  earnings: {
    creditsEarned: { type: Number, default: 0 },
    creditsUsed: { type: Number, default: 0 }
  },

  ownerRating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Owner", ownerSchema);
