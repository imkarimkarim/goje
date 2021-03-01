const { db } = require("../db");

const getLastId = (callback) => {
  db.find({ doc: "customId" }, (err, docs) => {
    if (err) throw err;
    if (typeof callback === "function") {
      callback(docs[0].lastId);
    }
  });
};

const setLastId = (newId) => {
  newId = Number(newId);
  if (typeof newId !== "number") return;
  db.update({ doc: "customId" }, { $set: { lastId: newId } });
};

module.exports = {
  getLastId,
  setLastId,
};
