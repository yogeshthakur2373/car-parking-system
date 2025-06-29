const {
  parkingSpots,
  parkingSessions,
  rates,
} = require("../models/inMemoryStore.js");

const { calculateFee } = require("../utils/feeCalculator.js");
const { VehicleType, SpotSize } = require("../models/enums.js");

const sizeMap = {
  [VehicleType.MOTORCYCLE]: SpotSize.SMALL,
  [VehicleType.CAR]: SpotSize.MEDIUM,
  [VehicleType.BUS]: SpotSize.LARGE,
};

// ✅ Check-In Logic
function checkIn(licensePlate, vehicleType) {
  if (!Object.values(VehicleType).includes(vehicleType)) {
    throw new Error("Invalid vehicle type");
  }

  // Prevent duplicate check-in
  const existing = parkingSessions.find(
    (s) => s.licensePlate === licensePlate && !s.exitTime
  );
  if (existing) {
    throw new Error("Vehicle already checked in");
  }

  const requiredSize = sizeMap[vehicleType];

  // Find available spot
  const spot = parkingSpots.find(
    (s) => s.size === requiredSize && !s.isOccupied
  );

  if (!spot) throw new Error("No available spot for this vehicle type");

  // Mark spot as occupied
  spot.isOccupied = true;

  // Create session
  const session = {
    id: parkingSessions.length + 1,
    licensePlate,
    vehicleType,
    spotNumber: spot.spotNumber,
    entryTime: new Date(),
    exitTime: null,
    fee: null,
  };

  parkingSessions.push(session);

  return spot.spotNumber;
}

// ✅ Check-Out Logic
function checkOut(licensePlate) {
  const session = parkingSessions.find(
    (s) => s.licensePlate === licensePlate && !s.exitTime
  );
  if (!session) throw new Error("No active session");

  session.exitTime = new Date();
  session.fee = calculateFee(
    session.vehicleType,
    session.entryTime,
    session.exitTime
  );

  const spot = parkingSpots.find((s) => s.spotNumber === session.spotNumber);
  if (spot) spot.isOccupied = false;

  return {
    durationHours: Math.ceil(
      (session.exitTime - session.entryTime) / (1000 * 60 * 60)
    ),
    fee: session.fee,
  };
}

// ✅ Get All Sessions
function getAllSessions() {
  return parkingSessions;
}

module.exports = {
  checkIn,
  checkOut,
  getAllSessions,
};
