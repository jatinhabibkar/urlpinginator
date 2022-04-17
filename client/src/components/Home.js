import React, { Fragment, useEffect, useState } from "react";
import M from "materialize-css/dist/js/materialize.min";
import { CardLinks } from "./CardLinks";
import { Header } from "../layout/Header";
import axios from "axios";
import { Background } from "../layout/Background";
export const Home = ({ data, setData, loading, setLoading }) => {
  const [current, setCurrent] = useState({
    link: "",
    frequency: 30,
  });
  const mytoast = (msg) => {
    M.Toast.dismissAll();
    M.toast({ html: msg });
  };

  const handleSubmit = async () => {
    const elems = document.querySelector("#modal1");
    const instance = M.Modal.getInstance(elems);
    const { link, frequency } = current;
    if (link === "" || frequency < 1) {
      mytoast("plz enter url and frequency");
      return;
    }
    if (link.indexOf("http://") === 0 || link.indexOf("https://") === 0) {
      instance.close();
      setLoading(true);
      try {
        const res = await axios.post("/api/v1/addcron", {
          link: link,
          frequency: frequency,
        });
        if (res.status === 201) {
          const { id } = res.data;
          setData([{ ...current, _id: id, data: [] }, ...data]);
          setCurrent({
            link: "",
            frequency: 30,
            is_active: false,
          });
        } else {
          mytoast(res.data.msg);
        }
      } catch (error) {
        mytoast(error);
      }
      setLoading(false);
    } else {
      mytoast("plz provide a http or https url");
      return;
    }
  };

  const deleteLink = async (itemId) => {
    setLoading(true);
    const res = await axios.put("/api/v1/delcron", {
      fid: itemId,
    });
    if (res.status === 202) {
      setData(data.filter((i) => i._id !== itemId));
    } else {
      mytoast(res.data.msg);
    }
    setLoading(false);
  };

  useEffect(() => {
    var elems = document.querySelectorAll(".modal");
    const options = {
      inDuration: 250,
      outDuration: 250,
      opacity: 0.5,
      dismissible: false,
      startingTop: "4%",
      endingTop: "10%",
    };
    M.Modal.init(elems, options);
  }, []);

  return (
    <Fragment>
      <div id="modal1" className="modal ">
        <div className="modal-header">
          <button className="modal-close  red white-text btn-flat right">
            <i className="material-icons">close</i>
          </button>
        </div>
        <div className="modal-content">
          <h4>Add a url</h4>
          <div className="input-field col s6">
            <input
              id="url"
              type="url"
              name="link"
              className="validate"
              value={current.link}
              onChange={(e) => {
                setCurrent({ ...current, [e.target.name]: e.target.value });
              }}
            />
            <label htmlFor="url">Enter a https:// url</label>
          </div>
          <br />
          <div className="input-field col s6">
            <p className="range-field">
              <label htmlFor="frequency" className="left">
                <span style={{ fontSize: "25px" }}>
                  {"pinging server every " +current.frequency + " mins"}
                </span>
              </label>
              <input
                id="frequency"
                type="range"
                name="frequency"
                value={current.frequency}
                max={60}
                min={1}
                className="validate"
                onChange={(e) => {
                  setCurrent({ ...current, [e.target.name]: e.target.value });
                }}
              />
            </p>
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={handleSubmit} className=" green btn-flat">
            track
          </button>
        </div>
      </div>

      <Header loading={loading} />

      <br />
      {data && data.length > 0 ? (
        <div className="container ">
          <div className="row">
            {data.map((item) => {
              return (
                <Fragment key={item._id}>
                  <CardLinks {...item} deleteLink={deleteLink} />
                </Fragment>
              );
            })}
            <Background />
          </div>
        </div>
      ) : (
        <Fragment>
          <h3 className="container grey-text " style={{ marginTop: "35vh" }}>
            Start adding tracker by clicking{" "}
            <i className="material-icons">add</i>{" "}
          </h3>
          <br />
          <Background />
        </Fragment>
      )}
    </Fragment>
  );
};
