import { any } from "prop-types";
import React from "react";
import { Navigate } from "react-router-dom";
import { getLocal } from "../../ultis/storage";
const Privateadmin = ({ children }) => {
  const { isAdmin } = getLocal();
  return isAdmin ? (
    children
  ) : isAdmin === false ? (
    <Navigate to="/" />
  ) : (
    <Navigate to="/404" />
  );
};
Privateadmin.propTypes = {
  children: any,
};
export default Privateadmin;
