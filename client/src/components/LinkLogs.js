import axios from "axios";
import React, { Fragment, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Header } from "../layout/Header";
import M from "materialize-css";
import { Background } from "../layout/Background";
export const LinkLogs = ({refresh}) => {
  const activeDeactivestyle = {
    padding: "2px",
    borderRadius: "5px",
  };
  const [sdata, setsdata] = useState([]);
  const [l, sl] = useState(false);
  const mytoast = (msg) => {
    M.Toast.dismissAll();
    M.toast({ html: msg });
  };
  const Linkid = useParams()["Linkid"];
  async function fetchData() {
    sl(true);
    try {
      const myres = await axios.get(`/api/v1/data/${Linkid}`);
      if (myres.status === 200) {
        setsdata(myres.data.data.data);
      } else {
        mytoast("something went wrong");
      }
    } catch (error) {
      mytoast(error);
    }
    sl(false);
    refresh()
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Fragment>
      <Header loading={l} />
      <br />
      <div className="container ">
        <table>
          <thead>
            <tr>
              <th className="center">timestamp</th>
              <th className="center">status</th>
              <th className="center">is_active</th>
            </tr>
          </thead>
          <tbody>
            {sdata &&
              [...sdata].reverse().map((item) => {
                return (
                  <tr key={item._id}>
                    <td className="center">
                      {new Date(item.timestamp).toLocaleString()}
                    </td>
                    <td className="center">{item.status}</td>
                    <td className="center">
                      {" "}
                      {item.is_active ? (
                        <span
                          className="green white-text"
                          style={activeDeactivestyle}
                        >
                          Active
                        </span>
                      ) : (
                        <span
                          className="red white-text"
                          style={activeDeactivestyle}
                        >
                          NotActive
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <Background />

    </Fragment>
  );
};
