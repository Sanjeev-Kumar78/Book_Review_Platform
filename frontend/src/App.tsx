import { Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="text-2xl font-bold text-center mt-10">Home Page</div>
        }
      />
      <Route
        path="*"
        element={
          <div className="text-xl text-center mt-10">Page Not Found</div>
        }
      />
    </Routes>
  );
};

export default App;
