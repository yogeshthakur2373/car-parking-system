const { rates } = require("../models/inMemoryStore.js");

function calculateFee(vehicleType, entryTime, exitTime) {
  const durationHours = Math.ceil((exitTime - entryTime) / (1000 * 60 * 60));
  return durationHours * (rates[vehicleType] || 0);
}

module.exports = {
  calculateFee,
};
