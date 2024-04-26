import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/Home";
import AboutPage from "./pages/About";
import SignUpPage from "./pages/SignUp";
import SignInPage from "./pages/SignIn";
import NavRootLayout from "./pages/NavRoot";
import ProfilePage from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";
import SignInPrivateRoute from "./components/SignInPrivateRoute";
import SignUpPrivateRoute from "./components/SignUpPrivateRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <NavRootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/about", element: <AboutPage /> },
      {
        element: <SignInPrivateRoute />,
        children: [{ path: "/sign-in", element: <SignInPage /> }],
      },
      {
        element: <SignUpPrivateRoute />,
        children: [{ path: "/sign-up", element: <SignUpPage /> }],
      },

      {
        element: <PrivateRoute />,
        children: [{ path: "/profile", element: <ProfilePage /> }],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
