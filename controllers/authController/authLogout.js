export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({success : true, message : "logged out successfully"});
};