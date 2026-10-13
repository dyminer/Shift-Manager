import { createRandomWorkerTraits } from "./traits.js";

export const gameState = {

day : 1,
cash : 1000,
employeeCapacityUpgrades: {},
zoneEquipment: {
    receiving: [],
    storage: [],
    picking: [],
    packing: [],
    shipping: []
},

workers : [
    {
    id: 1,
    name: "Dave",
    zone: "receiving",
    productivity: 5,
    reliability: 5,
    morale: 5,
    traits: createRandomWorkerTraits(),
    discoveredTraitIds: [],
    knowledgeAwardedTraitIds: []
},
    {
    id: 2,
    name: "Rick",
    zone: "receiving",
    productivity: 5,
    reliability: 5,
    morale: 5,
    traits: createRandomWorkerTraits(),
    discoveredTraitIds: [],
    knowledgeAwardedTraitIds: []
},
    {
    id: 3,
    name: "Jim",
    zone: "shipping",
    productivity: 5,
    reliability: 5,
    morale: 5,
    traits: createRandomWorkerTraits(),
    discoveredTraitIds: [],
    knowledgeAwardedTraitIds: []
}
],

receiving: [],
storage: [],
picking: [],
packing: [],
shipping: [],

nextOrderId : 1,
completed : 0,
draggedWorkerId : null,
orderAnimationId : 0,
week : 1,
rerolls : 1,
draftPool : [],
}