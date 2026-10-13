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
    traits: [
        { id: "receiving-specialist" },
        { id: "storage-organizer" },
        { id: "receiving-rushed" },
        { id: "picking-distracted" },
        { id: "mentor" }
    ],
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
    traits: [
        { id: "careful-packer" },
        { id: "shipping-veteran" },
        { id: "receiving-rushed" },
        { id: "shipping-slowdown" },
        { id: "team-player" }
    ],
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
    traits: [
        { id: "shipping-veteran" },
        { id: "quick-picker" },
        { id: "storage-careless" },
        { id: "packing-impatient" },
        { id: "disruptive" }
    ],
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