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
import DoneIcon from "@material-ui/icons/Done";
import Grid from "@material-ui/core/Grid";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import Nav from "../../Components/Nav.jsx";
import Input from "../../Components/Input.jsx";
import ExpenseInput from "../../Components/ExpenseInput.jsx";
import "./IncludeCar.css";
import reducer from "../../Reducers/IncludeCarReducer.jsx";
import CarProductTable from "../../Components/Car/CarProductTable.jsx";
import CarProductInput from "../../Components/Car/CarProductInput.jsx";
import ProductOwnerInput from "../../Components/ProductOwner/ProductOwnerInput.jsx";
import { NotifContext } from "../../Contexts/NotifContext.jsx";
import { generateInputByUserCarSchema } from "../../../schemas.js";

const schema = generateInputByUserCarSchema();

export default function IncludeCar({ history }) {
  const [formData, formDispatch] = useReducer(reducer, schema);
  const [submit, setSubmit] = useState(false);
  const [createStatus, setCreateStatus] = useState(null);
  const { pushNotif } = useContext(NotifContext);

  const handleSubmit = () => {
    setSubmit(true);
    includeCar(formData);
  };

  const includeCar = (car) => {
    ipcRenderer.send("includeCar", car);
  };

  useEffect(() => {
    ipcRenderer.on("includeCar", (event, createStatus) => {
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
      ipcRenderer.removeAllListeners("includeCar");
    };
  });

  return (
    <div>
      <Nav history={history} />
      <form className="IncludeCar-form goje-container">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <span className="arrivalDate">
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
            </span>
            <ProductOwnerInput
              label="نام صاحب بار*"
              className="customeInputAndPicker"
              onPick={(name, id) => {
                formDispatch({
                  type: "setowner",
                  payload1: name,
                  payload2: id,
                });
              }}
              owner={formData && formData.owner}
            />
            <Input
              id="plaque"
              label="پلاک ماشین"
              fun={(e) => {
                formDispatch({ type: "setPlaque", payload: e.target.value });
              }}
              value={formData.plaque}
            />
            <Input
              label="باسکول کل(kg)*"
              fun={(e) => {
                formDispatch({
                  type: "setbasculeWeight",
                  payload: e.target.value,
                });
              }}
              value={formData.basculeWeight}
            />
            <ExpenseInput
              label="کرایه*"
              fun={(e) => {
                formDispatch({ type: "setportage", payload: e.target.value });
              }}
              value={formData.portage}
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
            <CarProductTable
              formDispatch={formDispatch}
              products={formData.products}
            />
            <CarProductInput formDispatch={formDispatch} />
            <ExpenseInput
              label="دستی*"
              fun={(e) => {
                formDispatch({ type: "setcash", payload: e.target.value });
              }}
              value={formData.cash}
            />
            <TextareaAutosize
              className="ps-input"
              onChange={(e) => {
                formDispatch({ type: "setPs", payload: e.target.value });
              }}
              value={formData.ps}
              rowsMin={3}
              placeholder="پی نوشت"
            />
          </Grid>
          <br />

          <Grid item xs={12}>
            <Button
              disabled={submit}
              onClick={handleSubmit}
              variant="outlined"
              color="primary"
            >
              ثبت <DoneIcon />
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}
