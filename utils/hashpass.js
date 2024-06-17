const argon2 = require("argon2");

// Asynchronous function to hash a password using argon2
async function hashPassword(password) {
  try {
    // Hash the password with argon2 using the argon2id variant
    const hash = await argon2.hash(password, {
      type: argon2.argon2id,
    });
    // Return the hashed password
    return hash;
  } catch (err) {
    // Log any errors that occur during hashing
    console.error(err);
  }
}

// Asynchronous function to verify a password against a hash using argon2
async function verifyPassword(hash, password) {
  try {
    // Verify the password against the provided hash
    const match = await argon2.verify(hash, password);
    // Return true if the password matches the hash, false otherwise
    return match;
  } catch (err) {
    console.error(err); // Log any errors that occur during verification
  }
}

// Export the hashPassword and verifyPassword functions as a module
module.exports = { hashPassword, verifyPassword };
