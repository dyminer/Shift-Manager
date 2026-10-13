export const workerTraits = [
    {
        id: "receiving-specialist",
        name: "Receiving Specialist",
        description: "+2 productivity in Receiving.",
        polarity: "positive",
        kind: "area",
        zone: "receiving",
        productivityBonus: 2
    },
    {
        id: "storage-organizer",
        name: "Storage Organizer",
        description: "+2 productivity in Storage.",
        polarity: "positive",
        kind: "area",
        zone: "storage",
        productivityBonus: 2
    },
    {
        id: "quick-picker",
        name: "Quick Picker",
        description: "+2 productivity in Picking.",
        polarity: "positive",
        kind: "area",
        zone: "picking",
        productivityBonus: 2
    },
    {
        id: "careful-packer",
        name: "Careful Packer",
        description: "+2 productivity in Packing.",
        polarity: "positive",
        kind: "area",
        zone: "packing",
        productivityBonus: 2
    },
    {
        id: "shipping-veteran",
        name: "Shipping Veteran",
        description: "+2 productivity in Shipping.",
        polarity: "positive",
        kind: "area",
        zone: "shipping",
        productivityBonus: 2
    },
    {
        id: "receiving-rushed",
        name: "Rushed Receiver",
        description: "-1 productivity in Receiving.",
        polarity: "negative",
        kind: "area",
        zone: "receiving",
        productivityBonus: -1
    },
    {
        id: "storage-careless",
        name: "Careless Stocker",
        description: "-1 productivity in Storage.",
        polarity: "negative",
        kind: "area",
        zone: "storage",
        productivityBonus: -1
    },
    {
        id: "picking-distracted",
        name: "Easily Distracted",
        description: "-1 productivity in Picking.",
        polarity: "negative",
        kind: "area",
        zone: "picking",
        productivityBonus: -1
    },
    {
        id: "packing-impatient",
        name: "Impatient Packer",
        description: "-1 productivity in Packing.",
        polarity: "negative",
        kind: "area",
        zone: "packing",
        productivityBonus: -1
    },
    {
        id: "shipping-slowdown",
        name: "Slow Handoff",
        description: "-1 productivity in Shipping.",
        polarity: "negative",
        kind: "area",
        zone: "shipping",
        productivityBonus: -1
    },
    {
        id: "mentor",
        name: "Mentor",
        description: "Adds +1 productivity to each coworker in the same area.",
        polarity: "positive",
        kind: "coworker",
        benefit: "coworkers",
        productivityBonus: 1
    },
    {
        id: "team-player",
        name: "Team Player",
        description: "Gains +1 productivity for each coworker in the same area.",
        polarity: "positive",
        kind: "coworker",
        benefit: "self-per-coworker",
        productivityBonus: 1
    },
    {
        id: "disruptive",
        name: "Disruptive",
        description: "Reduces each coworker's productivity by 1 in the same area.",
        polarity: "negative",
        kind: "coworker",
        benefit: "coworkers",
        productivityBonus: -1
    },
    {
        id: "lone-wolf",
        name: "Lone Wolf",
        description: "Loses 1 productivity for each coworker in the same area.",
        polarity: "negative",
        kind: "coworker",
        benefit: "self-per-coworker",
        productivityBonus: -1
    }
];

const positiveTraits = workerTraits.filter(
    trait => trait.polarity === "positive" && trait.kind === "area"
);
const negativeTraits = workerTraits.filter(
    trait => trait.polarity === "negative" && trait.kind === "area"
);
const coworkerTraits = workerTraits.filter(
    trait => trait.kind === "coworker"
);

export function getWorkerTrait(traitId) {
    const trait = workerTraits.find(candidate => candidate.id === traitId);

    if (!trait) {
        throw new Error(`Unknown worker trait: ${traitId}`);
    }

    return trait;
}

function chooseRandomTraits(traits, count) {
    const available = [...traits];
    const chosen = [];

    while (chosen.length < count) {
        const index = Math.floor(Math.random() * available.length);
        chosen.push(available.splice(index, 1)[0]);
    }

    return chosen;
}

export function createRandomWorkerTraits() {
    const traits = [
        ...chooseRandomTraits(positiveTraits, 2),
        ...chooseRandomTraits(negativeTraits, 2)
    ];

    if (Math.random() < 0.5) {
        traits.push(...chooseRandomTraits(coworkerTraits, 1));
    }

    return traits.map(({ id }) => ({ id }));
}
