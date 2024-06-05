const argon2 = require("argon2");

async function hashPassword(password) {
  try {
    const hash = await argon2.hash(password, {
      type: argon2.argon2id,
    });
    return hash;
  } catch (err) {
    console.error(err);
  }
}

async function verifyPassword(hash, password) {
  try {
    const match = await argon2.verify(hash, password);
    return match;
  } catch (err) {
    console.error(err);
  }
}

module.exports = { hashPassword, verifyPassword };
