import React, {
  useState,
  useReducer,
  useEffect,
  useRef,
  useContext,
} from "react";
const { ipcRenderer } = require("electron");
import { useParams } from "react-router-dom";
import { DatePicker } from "jalali-react-datepicker";
import JDate from "jalali-date";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Radio from "@material-ui/core/Radio";
import Button from "@material-ui/core/Button";
import Nav from "../../Components/Nav.jsx";
import Input from "../../Components/Input.jsx";
import CustomerInput from "../../Components/Customer/CustomerInput.jsx";
import ExpenseInput from "../../Components/ExpenseInput.jsx";
import ProductsTable from "../../Components/Factor/ProductsTable.jsx";
import Conclusion from "../../Components/Factor/Conclusion.jsx";
import Expense from "../../Components/Expense.jsx";
import ProductInput from "../../Components/Product/ProductInput.jsx";
import Pays from "../../Components/Factor/Pays.jsx";
import "./EditFactor.css";
import ShowDate from "../../Components/ShowDate.jsx";
import reducer from "../../Reducers/EditFactorReducer.jsx";
import { NotifContext } from "../../Contexts/NotifContext.jsx";

const factorSchema = {
  docType: "factor",
  owner: "",
  ownerName: "",
  customeId: "",
  isPayed: "",
  factorDate: 0,
  changeDate: 0,
  products: [],
  calcs: [],
  pays: [],
  id: "",
};

export default function EditFactor() {
  const [formData, formDispatch] = useReducer(reducer, factorSchema);
  const [submit, setSubmit] = useState(false);
  const [editStatue, setEditStatue] = useState(null);
  const init = useRef(true);
  let { id } = useParams();
  const { pushNotif } = useContext(NotifContext);

  const handleSubmit = () => {
    setSubmit(true);
    editFactor(formData);
  };

  const editFactor = (factor) => {
    ipcRenderer.send("editFactor", factor);
  };

  const getOneFactor = (id) => {
    ipcRenderer.send("getOneFactor", id);
  };

  useEffect(() => {
    if (init.current) {
      getOneFactor(id);
      init.current = false;
    }

    ipcRenderer.on("getOneFactor", (event, oneFactor) => {
      formDispatch({ type: "setForm", payload: oneFactor });
    });

    ipcRenderer.on("editFactor", (event, editStatue) => {
      setSubmit(false);
      setEditStatue(editStatue);
      if (editStatue !== null) {
        if (editStatue === true) {
          pushNotif("success", "ویرایش با موفقیت انجام شد");
        }
        if (editStatue === false) {
          pushNotif("error", "حطا در ویرایش");
        }
      }
    });

    // clean up
    return () => {
      ipcRenderer.removeAllListeners("editFactor");
    };
  });

  return (
    <div>
      <Nav />
      <form className="EditFactor-form goje-container">
        <Grid container spacing={3}>
          <Grid className="header" item xs={12}>
            <CustomerInput
              label="نام مشتری*"
              className="customeInputAndPicker"
              onPick={(id, name) => {
                formDispatch({
                  type: "setOwner",
                  payload1: id,
                  payload2: name,
                });
              }}
              owner={formData && formData.owner}
              ownerName={formData && formData.ownerName}
            />
            <div>
              نقدی
              <Radio
                checked={formData.isPayed === true}
                style={{ color: "blue" }}
                onChange={() => {
                  formDispatch({ type: "setIsPayed", payload: true });
                }}
                value={true}
              />
            </div>
            <div>
              نسیه
              <Radio
                style={{ color: "red" }}
                checked={formData.isPayed === false}
                onChange={() => {
                  formDispatch({ type: "setIsPayed", payload: false });
                }}
                value={false}
              />
            </div>
            <div>
              وصولی
              <Radio
                style={{ color: "green" }}
                color="primary"
                checked={formData.isPayed === "receipt"}
                onChange={() => {
                  formDispatch({ type: "setIsPayed", payload: "receipt" });
                }}
                value={"receipt"}
              />
            </div>
            <div className="factorDate">
              {formData && formData.factorDate > 0 ? (
                <DatePicker
                  timePicker={false}
                  value={formData.factorDate}
                  onClickSubmitButton={({ value }) => {
                    formDispatch({
                      type: "setFactorDate",
                      payload: value._d.getTime(),
                    });
                    formDispatch({
                      type: "setChangeDate",
                      payload: Date.now(),
                    });
                  }}
                />
              ) : (
                <span></span>
              )}
              <div className="hint">
                آخرین تغییر در{" "}
                {formData && formData.changeDate ? (
                  <ShowDate timestamp={formData.changeDate} />
                ) : (
                  <span></span>
                )}
              </div>
            </div>
          </Grid>
          <Divider />
          <Grid item className="products-section" xs={12}>
            <ProductsTable
              products={formData.products}
              formDispatch={formDispatch}
            />
            <Conclusion products={formData.products} pays={formData.pays} />
          </Grid>
          <Grid item className="addproduct-section" xs={12}>
            <ProductInput formDispatch={formDispatch} label="شرح بار*" />
          </Grid>
          <Divider />
          {formData && formData.pays && formData.isPayed !== true ? (
            <Grid item className="addpay-section" xs={12}>
              <Pays
                formDispatch={formDispatch}
                pays={formData.pays}
                onSubmit={(pay) => {
                  formDispatch({
                    type: "addPay",
                    payload1: pay.date,
                    payload2: pay.amount,
                  });
                }}
              />
            </Grid>
          ) : (
            <div></div>
          )}
          <Grid item xs={12}>
            <Button
              disabled={submit}
              onClick={handleSubmit}
              variant="outlined"
              color="primary"
            >
              ثبت ویرایش
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}
