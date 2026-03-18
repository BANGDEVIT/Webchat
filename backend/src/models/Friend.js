import mongoose from "mongoose";

const friendSchema = new mongoose.Schema(
  {
    userA: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userB: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

friendSchema.pre("save", function () {
  const a = this.userA.toString();
  const b = this.userB.toString();

  if (a > b) {
    this.userA = new mongoose.Types.ObjectId(b);
    this.userB = new mongoose.Types.ObjectId(a);
  }
});

//  Friend.create([{}], { session }) dùng insertMany — và khi insertMany gọi pre("save") hook, nó không truyền next vào đúng cách → next là undefined → next() throw lỗi.

// friendSchema.pre("save", function (next) {
//   const a = this.userA.toString();
//   const b = this.userB.toString();

//   if (a > b) {
//     this.userA = new mongoose.Types.ObjectId(b);
//     this.userB = new mongoose.Types.ObjectId(a);
//   }
//   next();
// });

friendSchema.index({ userA: 1, userB: 1 }, { unique: true });

// {unique : true} Nó bắt buộc không được trùng cặp dữ liệu.
const Friend = mongoose.model("Friend", friendSchema);

export default Friend;
