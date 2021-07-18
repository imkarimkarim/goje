import React, {
  useState,
  useEffect,
  useRef,
  useReducer,
  useContext,
} from "react";
const { ipcRenderer } = require("electron");
import { DatePicker } from "jalali-react-datepicker";
import JDate from "jalali-date";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import Nav from "../../Components/Nav.jsx";
import Input from "../../Components/Input.jsx";
import ExpenseInput from "../../Components/ExpenseInput.jsx";
import "./IncludeProduct.css";
import reducer from "../../Reducers/IncludeProductReducer.jsx";
import { NotifContext } from "../../Contexts/NotifContext.jsx";

const newProduct = {
  productName: "",
  owner: "",
  basculeWeight: "",
  amount: "",
  arrivalDate: Date.now(),
  commission: "",
  unload: "",
  portage: "",
  cash: "",
  plaque: "",
  ps: "",
};

export default function IncludeProduct() {
  const [formData, formDispatch] = useReducer(reducer, newProduct);
  const [submit, setSubmit] = useState(false);
  const [createStatus, setCreateStatus] = useState(null);
  const { pushNotif } = useContext(NotifContext);

  const handleSubmit = () => {
    setSubmit(true);
    includeProduct(formData);
  };

  const includeProduct = (product) => {
    ipcRenderer.send("includeProduct", product);
  };

  useEffect(() => {
    ipcRenderer.on("includeProduct", (event, createStatus) => {
      setSubmit(false);
      setCreateStatus(createStatus);
      if (createStatus !== null) {
        if (createStatus === true) {
          let newNewProduct = newProduct;
          newNewProduct.arrivalDate = Date.now();
          formDispatch({ type: "setForm", payload: newNewProduct });
          pushNotif('success','بار با موفقیت وارد شد');
        }
        if (createStatus === false) {
          pushNotif('error','خطا در وارد کردن بار');
        }
      }
    });

    // clean up
    return () => {
      ipcRenderer.removeAllListeners("includeProduct");
    };
  });

  return (
    <div>
      <Nav />
      <form className="IncludeProduct-form goje-container">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Input
              label="شرح بار*"
              fun={(e) => {
                formDispatch({
                  type: "setproductName",
                  payload: e.target.value,
                });
              }}
              value={formData.productName}
            />
            <Input
              label="نام صاحب بار*"
              fun={(e) => {
                formDispatch({ type: "setowner", payload: e.target.value });
              }}
              value={formData.owner}
            />
            <Input
              label="پلاک ماشین"
              fun={(e) => {
                formDispatch({ type: "setPlaque", payload: e.target.value });
              }}
              value={formData.plaque}
            />
            <div className="arrivalDate">
              <span>تاریخ ورود:</span>
              <DatePicker
                timePicker={false}
                value={formData.arrivalDate}
                onClickSubmitButton={({ value }) => {
                  formDispatch({
                    type: "setarrivalDate",
                    payload: value._d.getTime(),
                  });
                }}
              />
            </div>
            <Input
              label="باسکول(kg)*"
              fun={(e) => {
                formDispatch({
                  type: "setbasculeWeight",
                  payload: e.target.value,
                });
              }}
              value={formData.basculeWeight}
            />
            <Input
              label="تعداد*"
              fun={(e) => {
                formDispatch({ type: "setamount", payload: e.target.value });
              }}
              value={formData.amount}
            />
            <Input
              label="کارمزد(٪)*"
              fun={(e) => {
                formDispatch({
                  type: "setcommission",
                  payload: e.target.value,
                });
              }}
              value={formData.commission}
            />
            <ExpenseInput
              label="تخلیه*"
              fun={(e) => {
                formDispatch({ type: "setunload", payload: e.target.value });
              }}
              value={formData.unload}
            />
            <ExpenseInput
              label="کرایه*"
              fun={(e) => {
                formDispatch({ type: "setportage", payload: e.target.value });
              }}
              value={formData.portage}
            />
            <ExpenseInput
              label="دستی*"
              fun={(e) => {
                formDispatch({ type: "setcash", payload: e.target.value });
              }}
              value={formData.cash}
            />
          </Grid>
          <br />

          <Grid item xs={12}>
            <TextareaAutosize
              onChange={(e) => {
                formDispatch({ type: "setPs", payload: e.target.value });
              }}
              value={formData.ps}
              rowsMin={3}
              placeholder="پی نوشت"
            />
            <br />
            <Button
              disabled={submit}
              onClick={handleSubmit}
              variant="outlined"
              color="primary"
            >
              ثبت
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}
