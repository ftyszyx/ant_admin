import ReactDOM from "react-dom/client";
import RootRouter from "./router";
import "normalize.css";
import "@/assets/styles/default.less";
import "@/assets/styles/global.less";
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <RootRouter></RootRouter>
);
