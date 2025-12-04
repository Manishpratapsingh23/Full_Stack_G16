import mongoose from "mongoose";

const borrowerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  borrowedBooks: [
    {
      book: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
      borrowDate: Date,
      dueDate: Date,
      returnDate: Date,
      status: {
        type: String,
        enum: ["pending", "approved", "rejected", "borrowed", "returned"],
        default: "pending"
      }
    }
  ],

  overdueCount: { type: Number, default: 0 },
  totalBorrowed: { type: Number, default: 0 },

  wishlist: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Book" }
  ],

  readingHabits: {
    mostBorrowedGenre: String,
    avgReturnTime: Number, // days
    borrowFrequency: Number // monthly
  },

  borrowerRating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Borrower", borrowerSchema);
