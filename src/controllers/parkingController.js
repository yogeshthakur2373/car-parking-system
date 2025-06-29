const express = require("express");
const service = require("../services/parkingService"); // Adjust the path as needed
const { parkingFloors, parkingSessions } = require("../models/inMemoryStore");

const router = express.Router();

router.post("/check-in", (req, res) => {
  try {
    const { licensePlate, vehicleType } = req.body;
    const spotNumber = service.checkIn(licensePlate, vehicleType);
    res.json({ message: "Checked in", spotNumber });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/check-out", (req, res) => {
  try {
    const { licensePlate } = req.body;
    const result = service.checkOut(licensePlate);
    res.json({ message: "Checked out", ...result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/sessions", (req, res) => {
  res.json(service.getAllSessions());
});

router.get("/floor-status/:floorId", (req, res) => {
  const floor = parkingFloors.find((f) => f.floorId == req.params.floorId);
  if (!floor) return res.status(404).json({ error: "Floor not found" });

  const total = floor.spots.length;
  const booked = floor.spots.filter((s) => s.isOccupied).length;
  res.json({
    floorId: floor.floorId,
    total,
    booked,
    available: total - booked,
  });
});


router.get("/floors", (req, res) => {
  const result = parkingFloors.map((floor) => ({
    floorId: floor.floorId,
    totalSpots: floor.spots.length,
    availableSpots: floor.spots.filter((s) => !s.isOccupied).length,
  }));
  res.json(result);
});
router.get("/stats", (req, res) => {
  const active = parkingSessions.filter((s) => !s.exitTime).length;
  const total = parkingSessions.length;
  const totalRevenue = parkingSessions.reduce(
    (sum, s) => sum + (s.fee || 0),
    0
  );
  res.json({ totalVehicles: total, activeVehicles: active, totalRevenue });
});
router.post("/book", (req, res) => {
  try {
    const { licensePlate, vehicleType, floorId, spotNumber } = req.body;

    const floor = parkingFloors.find((f) => f.floorId == floorId);
    if (!floor) return res.status(404).json({ error: "Floor not found" });

    const spot = floor.spots.find((s) => s.spotNumber === spotNumber && s.size);

    if (!spot)
      return res.status(404).json({ error: "Spot not found on floor" });

    if (spot.isOccupied)
      return res.status(400).json({ error: "Spot already occupied" });

    // Mark the spot as booked
    spot.isOccupied = true;

    // Create a session
    const session = {
      id: parkingSessions.length + 1,
      licensePlate,
      vehicleType,
      spotNumber: spot.spotNumber,
      floorId,
      entryTime: new Date(),
      exitTime: null,
      fee: null,
    };

    parkingSessions.push(session);

    res.json({ message: "Spot manually booked", spotNumber, floorId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
  
module.exports = router;
