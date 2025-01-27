import { createBrowserRouter } from "react-router-dom";
import Layout from "@/components/common/Layout";
import LoginPage from "@/pages/login/LoginPage";
import SignUpPage from "@/pages/signUp/SignUpPage";
import RecipeMainPage from "@/pages/community/RecipeMainPage";
import RecipeSearchPage from "@/pages/community/RecipeSearchPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
      {
        path: "signup",
        element: <SignUpPage />,
      },
      {
        path: "community",
        children: [
          {
            index: true,
            element: <RecipeMainPage/>,
          },
          {
            path: "recipe/search",
            element: <RecipeSearchPage/>
          }
        ]
      },
    ],
  },
  {
    path: "/",
    element: <Layout header={null} footer={null} />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
    ],
  },
]);

export default router;
