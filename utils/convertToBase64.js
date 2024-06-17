// Function to convert a file object to a Base64-encoded string
const convertToBase64 = file => {
  return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
};

module.exports = convertToBase64;
