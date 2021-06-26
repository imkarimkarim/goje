const Datastore = require("nedb");
const { getAppDataPath } = require("./modules/appDataPath");
const fs = require("fs");

const init = () => {
  db.find(
    {
      doc: "customId",
    },
    (err, docs) => {
      if (err) throw err;
      if (docs.length === 0) {
        // ids start from 47000 because programmer loves number 47
        db.insert({ doc: "customId", lastId : 47000});
      }
    }
  );
};

const appDataPath = getAppDataPath();
const dbPath = appDataPath + "/db";

if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath);
}

const filename = dbPath + "/goje.db";

const db = new Datastore({ filename: filename });
db.loadDatabase(function (err) {
  if (err) throw err;
  init();
});

module.exports = {
  db,
};
