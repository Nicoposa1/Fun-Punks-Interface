import { Route, Routes } from "react-router-dom";
import { Home } from "./views/Home";
import MainLayout from "./layouts/main/index";

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" exact component={Home} />
      </Routes>
    </MainLayout>
  );
}

export default App;
