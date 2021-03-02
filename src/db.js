const Datastore = require("nedb");
const { getAppDataPath } = require("./modules/appDataPath");
const fs = require("fs");

const init = () => {
  // making sure database will have 3 object in first init
  // db.find(
  //   {
  //     doc: "products",
  //   },
  //   (err, docs) => {
  //     if (err) throw err;
  //     if (docs.length === 0) {
  //       db.insert({ doc: "products", data: [] });
  //     }
  //   }
  // );
  // db.find(
  //   {
  //     doc: "factors",
  //   },
  //   (err, docs) => {
  //     if (err) throw err;
  //     if (docs.length === 0) {
  //       db.insert({ doc: "factors", data: [] });
  //     }
  //   }
  // );
  // db.find(
  //   {
  //     doc: "customers",
  //   },
  //   (err, docs) => {
  //     if (err) throw err;
  //     if (docs.length === 0) {
  //       db.insert({ doc: "customers", data: [] });
  //     }
  //   }
  // );
  db.find(
    {
      doc: "customId",
    },
    (err, docs) => {
      if (err) throw err;
      if (docs.length === 0) {
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
