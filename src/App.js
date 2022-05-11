import { Route, Routes } from "react-router-dom";
import Home from "./views/Home";
import Punks from "./views/Punks";
import MainLayout from "./layouts/main";

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/punks" exact element={<Punks />}></Route>
      </Routes>
    </MainLayout>
  );
}

export default App;
