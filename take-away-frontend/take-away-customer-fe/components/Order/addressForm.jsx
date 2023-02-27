import classes from "../../styles/AuthForm.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";

const AddresForm = ({ onSubmit }) => {
  const submit = (values) => {
    onSubmit(values);
  };
  const validationSchema = Yup.object({
    phone: Yup.string().required("Required"),
    street: Yup.string().required("Required"),
    door: Yup.string().required("Required"),
    postCode: Yup.string().required("Required"),
    city: Yup.string().required("Required"),
  });
  const initialValues = {
    phone: "",
    street: "",
    door: "",
    postCode: "",
    city: "",
    // address:""
  };
  const formik = useFormik({
    initialValues,
    submit,

    validationSchema,
  });
  return (
    <form onSubmit={formik.handleSubmit}>
      <div className={classes["form-control"]}>
        <label htmlFor="phone">Phone Number</label>
        <input
          type="text"
          name="phone"
          id="phone"
          placeholder="Phone Number"
          onChange={formik.handleChange}
          value={formik.values.phone}
          onBlur={formik.handleBlur}
        />
        {formik.touched.phone && formik.errors.phone ? (
          <p className={classes.error}>{formik.errors.phone}</p>
        ) : null}
      </div>

      <div className={classes["form-control"]}>
        <label htmlFor="street">Street Name</label>
        <input
          type="text"
          name="street"
          id="street"
          placeholder="Street Name"
          onChange={formik.handleChange}
          value={formik.values.street}
          onBlur={formik.handleBlur}
        />
        {formik.touched.street && formik.errors.street ? (
          <p className={classes.error}>{formik.errors.street}</p>
        ) : null}
      </div>

      <div className={classes["form-control"]}>
        <label htmlFor="door">Door Number</label>
        <input
          type="text"
          name="door"
          id="door"
          placeholder="Door Number"
          onChange={formik.handleChange}
          value={formik.values.door}
          onBlur={formik.handleBlur}
        />
        {formik.touched.door && formik.errors.door ? (
          <p className={classes.error}>{formik.errors.door}</p>
        ) : null}
      </div>

      <div className={classes["form-control"]}>
        <label htmlFor="postCode">Post Code</label>
        <input
          type="text"
          name="postCode"
          id="postCode"
          placeholder="Post Code"
          onChange={formik.handleChange}
          value={formik.values.postCode}
          onBlur={formik.handleBlur}
        />
        {formik.touched.postCode && formik.errors.postCode ? (
          <p className={classes.error}>{formik.errors.postCode}</p>
        ) : null}
      </div>

      <div className={classes["form-control"]}>
        <label htmlFor="city">City</label>
        <input
          type="text"
          name="city"
          id="city"
          placeholder="City"
          onChange={formik.handleChange}
          value={formik.values.city}
          onBlur={formik.handleBlur}
        />
        {formik.touched.city && formik.errors.city ? (
          <p className={classes.error}>{formik.errors.city}</p>
        ) : null}
      </div>

      <div className={classes["modal-save"]}>
        <button
          type="submit"
          disabled={!formik.isValid || formik.isSubmitting}
          onSubmit={submit}
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default AddresForm;
