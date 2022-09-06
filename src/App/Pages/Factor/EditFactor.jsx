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
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Radio from "@material-ui/core/Radio";
import DoneIcon from "@material-ui/icons/Done";
import Button from "@material-ui/core/Button";
import Nav from "../../Components/Nav.jsx";
import CustomerInput from "../../Components/Customer/CustomerInput.jsx";
import FactorProductsTable from "../../Components/Factor/FactorProductsTable.jsx";
import Conclusion from "../../Components/Factor/Conclusion.jsx";
import FactorProductInput from "../../Components/Factor/FactorProductInput.jsx";
import Pays from "../../Components/Factor/Pays.jsx";
import "./EditFactor.css";
import ShowDate from "../../Components/ShowDate.jsx";
import reducer from "../../Reducers/EditFactorReducer.jsx";
import { NotifContext } from "../../Contexts/NotifContext.jsx";

export default function EditFactor({ history }) {
  const [formData, formDispatch] = useReducer(reducer, {});
  const [submit, setSubmit] = useState(false);
  const [editStatus, setEditStatus] = useState(null);
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

    ipcRenderer.on("editFactor", (event, editStatus) => {
      setSubmit(false);
      setEditStatus(editStatus.status);
      if (editStatus.status !== null) {
        if (editStatus.status === true) {
          pushNotif("success", editStatus.message);
        }
        if (editStatus.status === false) {
          pushNotif("error", editStatus.message);
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
      <Nav history={history} />
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
            <FactorProductsTable
              products={formData.products}
              formDispatch={formDispatch}
            />
            <Conclusion products={formData.products} pays={formData.pays} />
          </Grid>
          <Grid item className="addproduct-section" xs={12}>
            <FactorProductInput formDispatch={formDispatch} label="شرح بار*" />
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
              ثبت ویرایش <DoneIcon />
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}
