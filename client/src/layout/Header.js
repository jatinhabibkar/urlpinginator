import React from "react";
import { Link } from "react-router-dom";
import { Loading } from "./Loading";

export const Header = ({ loading }) => {
  const path = window.location.pathname;

  return (
    <nav className="nav-extended">
      <div className="nav-wrapper">
        <Link to="/" className="brand-logo center">
          UrlPinginator
        </Link>
      </div>
      {loading && <Loading />}
      {path === "/" && (
        <div className="nav-content">
          <a
            className="btn-floating btn-large halfway-fab modal-trigger"
            href="#modal1"
          >
            <i className="material-icons">add</i>
          </a>
        </div>
      )}
    </nav>
  );
};
