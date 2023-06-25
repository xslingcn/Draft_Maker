import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Drafts from "./routes/drafts";
import Root from "./routes/root";
// import Draft from "./routes/draft";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';

export const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
    },
    {
      path: "/drafts",
      element: <Drafts />,
    }
  ]);

  return (
    <>
      <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      />
      <RouterProvider router={router}></RouterProvider>
    </>
  );
};
