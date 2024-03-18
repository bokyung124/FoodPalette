import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import Restaurant from "./pages/Restaurant";
import Footer from "./components/Footer";
import Search from "./pages/Search";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow bg-gray-50">
          <Routes>
            <Route
              path="/"
              element={<Home />}
            />
            <Route
              path="/sign-up"
              element={<SignUp />}
            />
            <Route
              path="/sign-in"
              element={<SignIn />}
            />
            {/* <Route
              path="/about"
              element={<About />}
            /> */}
            <Route
              path="/search"
              element={<Search />}
            />
            <Route
              path="/restaurant/:restId"
              element={<Restaurant />}
            />
            <Route element={<PrivateRoute />}>
              <Route
                path="/profile"
                element={<Profile />}
              />
            </Route>
          </Routes>
        </div>
        <div>
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
}
