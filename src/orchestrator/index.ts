import db from "../db";
import express from "express";
import { sendRequest } from "../worker/sendRequest";
const app = express();

app.use(express.json());

const PICKUP_BACKOFF_TIME_MS = 1000 * 60 * 60 * 2; // 2 hours

app.get("/next", async (req, res) => {
  const nextApplicationNumber = await db.applicationNumber.findFirst({
    where: {
       pickupTime: null
    }
  });
  if (!nextApplicationNumber) {
    return res.status(404).json({ error: "No application found" });
  }

  await db.applicationNumber.update({
    where: {
      id: nextApplicationNumber?.id
    },
    data: {
      pickupTime: new Date()
    }
  });
  
  res.json({
    applicationNumber: nextApplicationNumber?.applicationNumber
  });
});

app.post("/result", async (req, res) => {
  const { applicationNumber, candidateName, allIndiaRank, day, month, year, marks } = req.body;

  if (!result.solved) {
    return res.status(400).json({ error: "Application not found" });
  }
  console.log("result stored", )

  await db.result.create({
    data: {
      applicationNumber,
      candidateName,
      allIndiaRank,
      day,
      month,
      year,
      marks
    }
  });

//   await db.applicationNumber.update({
//     where: {
//       id: applicationNumber
//     },
//     data: {
//       solved: true
//     }
//   });

  res.json({});
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.get("/total", async (req, res) => {
  const total = await db.result.findMany({
    where: {
        marks: {
            not: null
        }
    }
  });
  res.json({ len: total.length, total });
});
