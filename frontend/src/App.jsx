import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.scss";
import { Layout, RequireAuth } from "./routes/layout/Layout";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./routes/homepage/HomePage";
import ListPage from "./routes/list/ListPage";
import SinglePropertyPage from "./routes/singlePropertyPage/SinglePropertyPage";
import Login from "./routes/login/Login";
import Register from "./routes/register/Register";
import ProfilePage from "./routes/profilepage/ProfilePage";
import ProfileUpdatePage from "./routes/profileupdatepage/ProfileUpdatePage";
import NewPostPage from "./routes/newpostpage/NewPostPage";
import About from "./routes/about/About";
import Contact from "./routes/contact/Contact";
import Agents from "./routes/agents/Agents";
import {
  listPageLoader,
  profilePageLoader,
  singlePageLoader,
} from "./lib/loader.js";

function App() {
  const [count, setCount] = useState(0);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/about",
          element: <About />,
        },
        {
          path: "/contact",
          element: <Contact />,
        },
        {
          path: "/agents",
          element: <Agents />,
        },
        {
          path: "/list",
          element: <ListPage />,
          loader: listPageLoader,
        },
        {
          path: "/:id",
          element: <SinglePropertyPage />,
          loader: singlePageLoader,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
      ],
    },
    {
      path: "/",
      element: <RequireAuth />,
      children: [
        {
          path: "/profile",
          element: <ProfilePage />,
          loader: profilePageLoader,
        },
        {
          path: "/profile/update",
          element: <ProfileUpdatePage />,
          loader: profilePageLoader,
        },
        {
          path: "/add",
          element: <NewPostPage />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
