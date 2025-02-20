import { makeStyles } from "@mui/styles";
import Header from "./Header";
import { Outlet } from "react-router-dom";

const useStyles = makeStyles({
  page: {
    background: "#f9f9f9",
    width: "100%",
  },
});

export default function Layout() {
  const classes = useStyles();

  return (
    <div>
        <Header/>
      <div className={classes.page}>
        <Outlet/>
      </div>
    </div>
  );
}
