import express from "express";
import EnergyCollection from "../models/EnergyCollection"; // Adjust path if needed

const router = express.Router();

router.get("/trend", async (req, res) => {
  try {
    const viewMode = req.query.range === "30d" ? 30 : 7;
    const endDate = new Date(); // today
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - (viewMode - 1));

    const trendData = await EnergyCollection.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(startDate.toDateString()),
            $lte: new Date(endDate.toDateString()),
          },
        },
      },
      {
        $group: {
         _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          kWh: { $sum: "$usage" },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          name: "$_id",
          kWh: 1,
          _id: 0,
        },
      },
    ]);

    res.json(trendData);
  } catch (err) {
    console.error("Trend fetch error:", err);
    res.status(500).json({ error: "Failed to fetch energy trend" });
  }
});

export default router;
