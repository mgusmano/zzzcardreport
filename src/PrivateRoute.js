import React from "react";
import { Route } from "react-router-dom";
import { useAuth } from "./context/auth";
import Login from "./pages/login/Login";

function PrivateRoute({ component: Component, ...rest }) {
  const { authTokens } = useAuth();
  // console.log(authTokens)

  return (
    <Route
      {...rest}

      render={props =>
        authTokens ? (
          <Component {...props} />
        ) : (
          <Route path="/login" element={<Login replace to={props.location} />} />
        )
      }


      // render={props =>

      //     <Component {...props} />

      // }

    />
  );
}

export default PrivateRoute;