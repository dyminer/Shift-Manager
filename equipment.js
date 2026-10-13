import { gameState } from "./gameState.js";
import {
    getEquipmentSlotCount,
    purchaseEquipmentSlotUpgrade
} from "./progression.js";

export const warehouseZones = [
    "receiving",
    "storage",
    "picking",
    "packing",
    "shipping"
];

export const baseEmployeeCapacity = 2;
export const employeeCapacityUpgradeCost = 500;

export function formatZoneName(zone) {
    return `${zone[0].toUpperCase()}${zone.slice(1)}`;
}

export const equipmentCatalog = [
    {
        id: "powered-conveyor",
        name: "Powered Conveyor",
        description: "+1 productivity for every employee in this area.",
        price: 400,
        attributeBonuses: { productivity: 1 }
    },
    {
        id: "quality-scanner",
        name: "Quality Scanner",
        description: "+2 reliability for every employee in this area.",
        price: 500,
        attributeBonuses: { reliability: 2 }
    },
    {
        id: "comfort-station",
        name: "Comfort Station",
        description: "+2 morale for every employee in this area.",
        price: 500,
        attributeBonuses: { morale: 2 }
    },
    {
        id: "process-library",
        name: "Process Library",
        description: "Reveals traits of employees in this area without awarding TK.",
        price: 700,
        revealsTraits: true
    },
    {
        id: "knowledge-archive",
        name: "Knowledge Archive",
        description: "Passively generates 1 TK per day.",
        price: 1000,
        tribalKnowledgePerDay: 1
    }
];

export function getEmployeeCapacity(zone) {
    return baseEmployeeCapacity +
        (gameState.employeeCapacityUpgrades[zone] ?? 0);
}

export function getEmployeeCount(zone) {
    return gameState.workers.filter(worker => worker.zone === zone).length;
}

export function getAvailableHireZone() {
    return warehouseZones.find(
        zone => getEmployeeCount(zone) < getEmployeeCapacity(zone)
    ) ?? null;
}

export function getEquipmentSlotLimit(zone) {
    return getEquipmentSlotCount(zone);
}

export function getEquipmentInZone(zone) {
    return gameState.zoneEquipment[zone] ?? [];
}

export function getEquipmentById(equipmentId) {
    const equipment = equipmentCatalog.find(
        item => item.id === equipmentId
    );

    if (!equipment) {
        throw new Error(`Unknown equipment: ${equipmentId}`);
    }

    return equipment;
}

export function getEquipmentBonus(zone, attribute) {
    return getEquipmentInZone(zone).reduce((bonus, installedItem) => {
        const equipment = getEquipmentById(installedItem.id);
        return bonus + (equipment.attributeBonuses?.[attribute] ?? 0);
    }, 0);
}

export function getEffectiveAttribute(worker, attribute) {
    return worker[attribute] + getEquipmentBonus(worker.zone, attribute);
}

export function purchaseEquipment(equipmentId, zone) {
    const equipment = getEquipmentById(equipmentId);
    const installedEquipment = getEquipmentInZone(zone);

    if (installedEquipment.length >= getEquipmentSlotLimit(zone)) {
        return "no-equipment-slots";
    }

    if (gameState.cash < equipment.price) {
        return "insufficient-cash";
    }

    gameState.cash -= equipment.price;
    installedEquipment.push({ id: equipment.id });

    if (equipment.revealsTraits) {
        revealTraitsInZone(zone);
    }

    return "purchased";
}

export function expandEmployeeCapacity(zone) {
    if (!warehouseZones.includes(zone)) {
        throw new Error(`Unknown warehouse area: ${zone}`);
    }

    if (gameState.cash < employeeCapacityUpgradeCost) {
        return "insufficient-cash";
    }

    gameState.cash -= employeeCapacityUpgradeCost;
    gameState.employeeCapacityUpgrades[zone] =
        (gameState.employeeCapacityUpgrades[zone] ?? 0) + 1;

    return "upgraded";
}

export function upgradeEquipmentSlots(zone) {
    if (!warehouseZones.includes(zone)) {
        throw new Error(`Unknown warehouse area: ${zone}`);
    }

    return purchaseEquipmentSlotUpgrade(zone);
}

export function revealTraitsInZone(zone) {
    const revealsTraits = getEquipmentInZone(zone).some(
        ({ id }) => getEquipmentById(id).revealsTraits
    );

    if (!revealsTraits) {
        return;
    }

    gameState.workers
        .filter(worker => worker.zone === zone)
        .forEach(worker => {
            worker.traits ??= [];
            worker.discoveredTraitIds ??= [];
            worker.knowledgeAwardedTraitIds ??= [];

            worker.traits.forEach(({ id }) => {
                if (!worker.discoveredTraitIds.includes(id)) {
                    worker.discoveredTraitIds.push(id);
                }
            });
        });
}

export function generatePassiveTribalKnowledge() {
    return warehouseZones.reduce((dailyTotal, zone) => {
        return dailyTotal + getEquipmentInZone(zone).reduce(
            (zoneTotal, { id }) =>
                zoneTotal +
                (getEquipmentById(id).tribalKnowledgePerDay ?? 0),
            0
        );
    }, 0);
}
