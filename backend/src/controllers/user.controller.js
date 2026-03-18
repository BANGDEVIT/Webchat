export const authMe = (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({ message: "ok", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal system error",
    });
  }
};
