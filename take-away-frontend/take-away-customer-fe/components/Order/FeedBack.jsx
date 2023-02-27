import classes from "../../styles/Confirmed.module.css";
import * as React from "react";
import { useState, useEffect, useContext } from "react";
import AuthContext from "../../stores/authContext";

import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Rating from "@mui/material/Rating";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useRouter } from "next/dist/client/router";

const StyledRating = styled(Rating)(({ theme }) => ({
  "& .MuiRating-iconEmpty .MuiSvgIcon-root": {
    color: theme.palette.action.disabled,
  },
}));

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const customIcons = {
  1: {
    icon: <SentimentVeryDissatisfiedIcon color="error" />,
    label: "Very Dissatisfied",
  },
  2: {
    icon: <SentimentDissatisfiedIcon color="error" />,
    label: "Dissatisfied",
  },
  3: {
    icon: <SentimentSatisfiedIcon color="warning" />,
    label: "Neutral",
  },
  4: {
    icon: <SentimentSatisfiedAltIcon color="success" />,
    label: "Satisfied",
  },
  5: {
    icon: <SentimentVerySatisfiedIcon color="success" />,
    label: "Very Satisfied",
  },
};

function IconContainer(props) {
  const { value, ...other } = props;
  return <span {...other}>{customIcons[value].icon}</span>;
}

IconContainer.propTypes = {
  value: PropTypes.number.isRequired,
};
const FeedBack = () => {
  const router = useRouter();
  const token = useContext(AuthContext);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (token) {
      router.push("/feedback");
    } else {
      router.push("/login");
    }
  }, []);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const handleClick = () => {
    setOpen(true);

    setTimeout(() => {
      router.push("/restaurant");
    }, 2000);
  };

  return (
    <div className={classes.confirmed}>
      <div className={classes.rate}>
        <h2>Rate Your Experience</h2>
        <div className={classes.feedback}>
          <h2>
            Restaurant :
            <span className={classes.service}>
              Service
              <span className={classes.styledRating}>
                <StyledRating
                  name="highlight-selected-only"
                  defaultValue={2}
                  IconContainerComponent={IconContainer}
                  getLabelText={(value) => customIcons[value].label}
                  highlightSelectedOnly
                />
              </span>
            </span>
          </h2>
          <span className={classes.food}>
            Food
            <span className={classes.styledRating}>
              <StyledRating
                name="highlight-selected-only"
                defaultValue={2}
                IconContainerComponent={IconContainer}
                getLabelText={(value) => customIcons[value].label}
                highlightSelectedOnly
              />
            </span>
          </span>

          <h2>Feedback:</h2>
          <span className={classes.textarea}>
            {" "}
            <textarea name="" id="" cols="40" rows="5"></textarea>
          </span>
        </div>
        <div className={classes.btn}>
          <button onClick={handleClick}>Submit</button>
        </div>
      </div>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Thanks for your feedback
        </Alert>
      </Snackbar>
    </div>
  );
};

export default FeedBack;
