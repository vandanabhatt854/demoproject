const getTestResponse = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Frontend and backend connection successful",
  });
};

module.exports = { getTestResponse };
