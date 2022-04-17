import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { Loading } from "../layout/Loading";

export const CardLinks = ({ data, link, frequency, _id, deleteLink }) => {
  const activeDeactivestyle = {
    padding: "2px",
    borderRadius: "5px",
  };
  const MyButton = {
    borderRadius: "5px",
    marginRight: "10px",
    marginTop: "5px",
  };
  const MyCard = {
    paddingTop: "5px",
    borderRadius: "5px",
    opacity: 0.9,
  };
  const MyLink = {
    wordWrap: "break-word",
    overflow: "hidden",
    height: "120px",
    marginBottom: "10px",
  };
  return (
    <div className="col s12 m6">
      <div className="card white darken-1" style={MyCard}>
        <button
          className="modal-close  red white-text btn-flat right"
          onClick={() => deleteLink(_id)}
          style={MyButton}
        >
          <i className="material-icons">delete</i>
        </button>

        <a
          href={link}
          rel="noreferrer"
          target="_blank"
          className="modal-close  blue white-text btn-flat right"
          style={MyButton}
        >
          <i className="material-icons">open_in_new</i>
        </a>
        <br />
        <div className="card-content black-text">
          <div style={MyLink}>
            <span className="card-title center">{link} </span>
          </div>

          {data.length > 0 && (
            <Fragment>
              {data[data.length - 1]["is_active"] ? (
                <span className="green white-text" style={activeDeactivestyle}>
                  Active
                </span>
              ) : (
                <span className="red white-text" style={activeDeactivestyle}>
                  NotActive
                </span>
              )} {" at "}
              {new Date(data[data.length - 1]['timestamp']).toLocaleString()}
            </Fragment>
          )}
          <p>pinging server every {frequency} mins</p>
        </div>
        {data.length === 0 && <Loading />}
        <div className="card-action">
          <Link to={`/${_id}`}>full details</Link>
        </div>
      </div>
    </div>
  );
};
