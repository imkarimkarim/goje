const { getLastId, setLastId } = require("../db/customId");

const generateNewCustomId = (callback) => {
  getLastId((lastId) => {
    const newId = lastId + 1;
    setLastId(newId);
    const id = lastId.toString(16);
    if (typeof callback === "function") {
      callback(id);
    }
  });
};

module.exports = {
  generateNewCustomId,
};
