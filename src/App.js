import { Route, Routes } from "react-router-dom";
import Home from "./views/Home";
import MainLayout from "./layouts/main";

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />}></Route>
      </Routes>
    </MainLayout>
  );
}

export default App;
