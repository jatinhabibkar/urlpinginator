const cron = require("node-cron");
const express = require("express");
const connectDB = require("./config/db");
const { default: axios } = require("axios");
const Database = require("./model/Database");
const path = require("path");
const cors = require("cors");

connectDB();

app = express();
app.use(
  express.json({
    extended: true,
  })
);
app.use(cors());

let allCron = [];

async function PingRequest(link, frequency) {
  let returnreq = {};
  try {
    let rs = await axios.get(link);
    console.log(rs.status, link, frequency);
    if (rs.status === 200) {
      returnreq = { status: rs.status, is_active: true };
    } else {
      returnreq = { status: rs.status, is_active: false };
    }
  } catch (error) {
    returnreq = { status: error + "", is_active: false };
  }
  return returnreq;
}

const driver = async (link, frequency) => {
  const linkresp = await PingRequest(link, frequency);
  await Database.findOneAndUpdate(
    { link: link },
    {
      $push: {
        data: {
          status: linkresp.status,
          is_active: linkresp.is_active,
          timestamp: Date.now(),
        },
      },
    },
    {
      upsert: true,
    }
  );
  console.log(`running a task every ${frequency} minutes link ${link}`);
};

app.post("/api/v1/addcron", async (req, res) => {
  const { link, frequency } = req.body;
  if (!link || !frequency)
    return res.status(200).json({
      msg: "plz provide link and frequency",
      data: { link, frequency },
    });
  // checking if the cron is present
  let id = "";
  let elitem = null;
  allCron.forEach((element) => {
    if (element.link === link) {
      elitem = element;
    }
  });
  if (elitem)
    return res
      .status(200)
      .json({ msg: "already cron running for this link", id: elitem._id });
  // checking if the cron is present

  // check db
  try {
    let crondb = await Database.findOne({ link: link });
    if (!crondb) {
      const db = new Database({
        link,
        frequency,
      });
      const dbres = await db.save();
      id = dbres["id"];
      driver(link, frequency);
    }
  } catch (error) {
    console.log("Error" + error);
    return res.status(500).json({ msg: "something went wrong", data: error });
  }
  let job = cron.schedule(`*/${frequency} * * * *`, async function () {
    driver(link, frequency);
  });
  allCron.push({ job, link: link, frequency: frequency, id: id.toString() });
  res.status(201).json({
    msg: `tracking ${link} every ${frequency}mins`,
    id: id.toString(),
  });
});

app.put("/api/v1/delcron", (req, res) => {
  const { fid } = req.body;
  if (!fid)
    return res.status(200).send({ msg: "wrong id provided", data: { link } });
  let rs = "no data found in cron jobs";
  try {
    allCron.forEach((element) => {
      if (element.id === fid) {
        Database.findByIdAndDelete(fid, (err) => {
          if (err) rs = "something went wrong";
        });
        element["job"].stop();
        rs = element.link + " stopped and deleted";
        return;
      }
    });
    allCron = allCron.filter((el) => el.id !== fid);
  } catch (error) {
    return res
      .status(500)
      .send({ msg: "something went wrong db", data: error });
  }
  res.status(202).send({ msg: rs, data: allCron });
});

app.get("/api/v1/data", async (req, res) => {
  try {
    const all = await Database.find({}).sort({ date: -1 });
    res.status(200).send({ msg: "ok", data: all });
  } catch (error) {
    res.status(500).send({ msg: "something went wrong", data: error });
  }
});

app.get("/api/v1/data/:id", async (req, res) => {
  let rs = "something went wrong";
  try {
    const item = await Database.findById(req.params.id);
    return res.status(200).send({ msg: "ok", data: item });
  } catch (error) {
    return res.status(500).send({ msg: rs, data: error });
  }
});

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  // restart all crons
  const all = await Database.find({});
  if (all.length > 0)
    try {
      all.forEach(({ frequency, link, _id }) => {
        let job = cron.schedule(`*/${frequency} * * * *`, async function () {
          driver(link, frequency);
        });
        allCron.push({
          job,
          link: link,
          frequency: frequency,
          id: _id.toString(),
        });
        console.log(_id.toString(), link, frequency);
      });
    } catch (error) {
      console.log("Error" + error);
    }
  // restart all crons
  console.log("server start at port 5000");
});
