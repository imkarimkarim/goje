import React, {
  useState,
  useEffect,
  useRef,
  useReducer,
  useContext,
} from "react";
const { ipcRenderer } = require("electron");
import { useParams } from "react-router-dom";
import { DatePicker } from "jalali-react-datepicker";
import JDate from "jalali-date";
import DoneIcon from "@material-ui/icons/Done";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import Nav from "../../Components/Nav.jsx";
import Input from "../../Components/Input.jsx";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import ExpenseInput from "../../Components/ExpenseInput.jsx";
import "./EditProduct.css";
import reducer from "../../Reducers/EditProductReducer.jsx";
import { NotifContext } from "../../Contexts/NotifContext.jsx";
import ProductOwnerInput from "../../Components/ProductOwner/ProductOwnerInput.jsx";

// TODO: add backend for edit product

const schema = {};

export default function EditProduct() {
  const [formData, formDispatch] = useReducer(reducer, schema);
  const [submit, setSubmit] = useState(false);
  const [editStatus, setEditStatus] = useState(null);
  const { pushNotif } = useContext(NotifContext);
  const init = useRef(true);
  let { id } = useParams();

  const handleSubmit = () => {
    setSubmit(true);
    editProduct(formData);
  };

  const editProduct = (product) => {
    ipcRenderer.send("editProduct", product);
  };

  const getOneProduct = (id) => {
    ipcRenderer.send("getOneProduct", id);
  };

  useEffect(() => {
    if (init.current) {
      getOneProduct(id);
      init.current = false;
    }

    ipcRenderer.on("getOneProduct", (event, product) => {
      formDispatch({ type: "setForm", payload: product });
    });

    ipcRenderer.on("editProduct", (event, editStatus) => {
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
      ipcRenderer.removeAllListeners("editProduct");
    };
  });

  return (
    <div>
      <Nav />
      <form className="EditProduct-form goje-container">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isProductFinish}
                  onChange={() => {
                    formDispatch({
                      type: "toggleIsProductFinish",
                      payload: "",
                    });
                  }}
                />
              }
              label="اتمام بار:"
              labelPlacement="start"
            />
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
                label="پلاک ماشین"
                fun={(e) => {
                  formDispatch({ type: "setPlaque", payload: e.target.value });
                }}
                value={formData.plaque}
              />
              <div className="arrivalDate">
                <span>تاریخ ورود:</span>
                {formData && formData.arrivalDate > 0 ? (
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
                ) : (
                  <span></span>
                )}
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
                label="تعداد"
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
                label="دستی"
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
                ثبت ویرایش <DoneIcon />
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}
