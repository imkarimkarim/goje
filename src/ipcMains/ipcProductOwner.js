const { ipcMain } = require("electron");
const productOwnerDocs = require("../db/productOwnerDocs");
const carDocs = require("../db/carDocs");
const calcOneProduct = require("../calculators/calcOneProduct");
const calcCar = require("../calculators/calcCar");
const { validateProductOwner } = require("../modules/validator");

ipcMain.on("getAllProductOwners", (event) => {
  productOwnerDocs.getAll((productOwners) => {
    event.reply("getAllProductOwners", productOwners);
  });
});

ipcMain.on("toggleHideInOwnersInput", (event, ownerId) => {
    productOwnerDocs.toggleHideInOwnersInput(ownerId, () => {
        event.reply("toggleHideInOwnersInput", true);
    });
});

ipcMain.on("getOneProductOwner", (event, id) => {
  productOwnerDocs.getOne(id, (docs) => {
    event.reply("getOneProductOwner", docs);
  });
});

ipcMain.on("findProductOwnerCars", (event, id) => {
  productOwnerDocs.search(id, (docs) => {
    event.reply("findProductOwnerCars", docs);
  });
});

// TODO: clean code
ipcMain.on("sumProductOwnerSelectedCars", (event, carsId) => {
  const cars = [];
  let index = 0;
  const getOneCar = (index) => {
    const carId = carsId[index];
    carDocs.getOne(carId, (car) => {
      let index2 = 0;
      let productsSales = [];
      const getOneProductCalcs = (index2) => {
        const productId = car.products[index2].customeId;
        calcOneProduct.calculate(productId, (results) => {
          productsSales.push(results);
          index2++;
          if (index2 < car.products.length) {
            getOneProductCalcs(index2);
          } else if (index2 == car.products.length) {
            calcCar.calculate(car, productsSales, (res) => {
              cars.push({
                ownerEarnings: res,
                arrivalDate: car.arrivalDate,
                printDate: car.printDate,
                plaque: car.plaque,
                customeId: car.customeId,
              });
            });
            index++;
            getOneCar(index);
            if (carsId.length === cars.length) {
              event.reply("sumProductOwnerSelectedCars", cars);
            }
          }
        });
      };
      getOneProductCalcs(index2);
    });
  };
  getOneCar(index);
});

ipcMain.on("addNewProductOwner", (event, productOwner) => {
  validateProductOwner(productOwner, (status, message) => {
    if (status === true) {
      productOwnerDocs.isProductOwnerExists(productOwner, (docs) => {
        if (docs.length === 0) {
          productOwnerDocs.insert(productOwner, () => {
            event.reply("addNewProductOwner", {
              status: status,
              message: "حساب جدید با موفقیت ایجاد شد",
            });
          });
        } else {
          event.reply("addNewProductOwner", {
            status: false,
            message: "خطا در ایجاد حساب(شاید حسابی با همین نام موجود باشد)",
          });
        }
      });
    }
    if (status === false) {
      event.reply("addNewProductOwner", { status: status, message: message });
    }
  });
});
