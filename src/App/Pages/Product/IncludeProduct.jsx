import React, {
  useState,
  useEffect,
  useReducer,
  useContext,
  useRef,
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
import { generateInputByUserProductSchema } from "../../../schemas.js";

const schema = generateInputByUserProductSchema();

export default function IncludeProduct() {
  const [formData, formDispatch] = useReducer(reducer, schema);
  const [submit, setSubmit] = useState(false);
  const [createStatus, setCreateStatus] = useState(null);
  const { pushNotif } = useContext(NotifContext);

  // const init = useRef(true);

  const handleSubmit = () => {
    setSubmit(true);
    includeProduct(formData);
  };

  const includeProduct = (product) => {
    ipcRenderer.send("includeProduct", product);
  };

  // const defaultFormData = {
  //   productName: "پرتقال",
  //   owner: "کریم شاطر",
  //   basculeWeight: 1500,
  //   amount: 50,
  //   arrivalDate: 1627830529325,
  //   finishDate: false,
  //   isProductFinish: false,
  //   commission: 5,
  //   unload: 500000,
  //   portage: 1000000,
  //   cash: 0,
  //   plaque: "حسام بارده",
  //   ps: "حساب تسویه کن",
  // };

  useEffect(() => {
    // if (init.current === true) {
    //   includeProduct(defaultFormData);
    //   init.current = false;
    // }
    ipcRenderer.on("includeProduct", (event, createStatus) => {
      setSubmit(false);
      setCreateStatus(createStatus.status);
      if (createStatus.status !== null) {
        if (createStatus.status === true) {
          let schemaWithFreshDate = schema;
          schemaWithFreshDate.arrivalDate = Date.now();
          formDispatch({ type: "setForm", payload: schemaWithFreshDate });
          pushNotif("success", createStatus.message);
        }
        if (createStatus.status === false) {
          pushNotif("error", createStatus.message);
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
