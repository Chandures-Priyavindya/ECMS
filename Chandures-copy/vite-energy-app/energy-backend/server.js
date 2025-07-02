const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Base machines list
const machines = [
  { name: "Machine A" },
  { name: "Machine B" },
  { name: "Machine C" },
  { name: "Machine D" },
  { name: "Machine E" },
];

// Helper: Generate random usage per machine per day
function generateDailyUsage(days) {
  return machines.map((machine) => {
    const dailyUsage = [];
    for (let i = 0; i < days; i++) {
      dailyUsage.push(Math.floor(80 + Math.random() * 150)); // 80–230 kWh
    }
    return { name: machine.name, dailyUsage };
  });
}

// Helper: Sum daily usages to get total per machine
function calculateTopConsumers(dailyUsages, topCount = 4) {
  const totals = dailyUsages.map(({ name, dailyUsage }) => ({
    name,
    usage: dailyUsage.reduce((sum, val) => sum + val, 0),
  }));

  return totals
    .sort((a, b) => b.usage - a.usage)
    .slice(0, topCount);
}

// Generate mock energy trend with formatted date labels
function generateEnergyTrend(dailyUsages, days) {
  const trend = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (days - 1));

  for (let day = 0; day < days; day++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + day);

    const label = currentDate.toLocaleDateString("en-US", {
      weekday: "short", 
      month: "short",   
      day: "numeric",  
    });

    const totalForDay = dailyUsages.reduce(
      (sum, machine) => sum + (machine.dailyUsage?.[day] || 0),
      0
    );

    trend.push({ name: label, kWh: totalForDay });
  }

  return trend;
}

//  alerts
const alerts = [
  { message: "High energy usage detected on Machine B" },
  { message: "Scheduled maintenance required for Machine C" },
];

// Generate summary data
function generateSummary(topConsumers) {
  const totalConsumption = topConsumers.reduce(
    (sum, c) => sum + (c.usage || 0),
    0
  );
  const highestConsumer = topConsumers[0]?.name || "N/A";

  return {
    totalConsumption,
    totalConsumptionChange: "+5%",
    highestConsumer,
    highestConsumerChange: "+10%",
    energyEfficiency: 78,
    energyEfficiencyChange: "+2%",
    topConsumers,
  };
}

// API Endpoint
app.get("/api/dashboard-data", (req, res) => {
  try {
    let days = parseInt(req.query.days);
    if (isNaN(days) || days < 1) days = 7;
    if (days > 30) days = 30;

    const dailyUsages = generateDailyUsage(days);
    const topConsumers = calculateTopConsumers(dailyUsages);
    const energyTrend = generateEnergyTrend(dailyUsages, days);
    const summary = generateSummary(topConsumers);

    res.json({
      energyTrend,
      summary,
      alerts,
    });
  } catch (error) {
    console.error(" Error generating dashboard data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(` Backend server running at http://localhost:${PORT}`);
});



