const { SpotSize, VehicleType } = require("./enums.js");
const vehicles = []; 

const parkingSpots = [
  { id: 1, spotNumber: "A1", size: SpotSize.SMALL, isOccupied: false },
  { id: 2, spotNumber: "A2", size: SpotSize.MEDIUM, isOccupied: false },
  { id: 3, spotNumber: "A3", size: SpotSize.LARGE, isOccupied: false },
];

const parkingSessions = [];

const rates = {
  [VehicleType.MOTORCYCLE]: 10,
  [VehicleType.CAR]: 20,
  [VehicleType.BUS]: 30,
};
const parkingFloors = [
  {
    floorId: 1,
    spots: [
      { id: 1, spotNumber: "A1", size: SpotSize.SMALL, isOccupied: false },
      { id: 2, spotNumber: "A2", size: SpotSize.MEDIUM, isOccupied: false },
      { id: 3, spotNumber: "A3", size: SpotSize.LARGE, isOccupied: false },
    ],
  },
  {
    floorId: 2,
    spots: [
      { id: 4, spotNumber: "B1", size: SpotSize.SMALL, isOccupied: false },
      { id: 5, spotNumber: "B2", size: SpotSize.MEDIUM, isOccupied: false },
      { id: 6, spotNumber: "B3", size: SpotSize.LARGE, isOccupied: false },
    ],
  },
];
module.exports = {
  vehicles,
  parkingSpots,
  parkingSessions,
  rates,
  parkingFloors
};