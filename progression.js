const progressionStorageKey = "warehouseManagerProgression";
const traitVisibilityCost = 5;
export const equipmentSlotUpgradeCost = 5;

function loadProgression() {
    const savedProgression = localStorage.getItem(progressionStorageKey);

    if (savedProgression === null) {
        return {
            tribalKnowledge: 0,
            traitVisibilityUnlocked: false,
            equipmentSlotUpgrades: {}
        };
    }

    let progression;

    try {
        progression = JSON.parse(savedProgression);
    } catch (error) {
        throw new Error("Saved tribal knowledge progression is invalid.", {
            cause: error
        });
    }

    if (
        !progression ||
        !Number.isInteger(progression.tribalKnowledge) ||
        progression.tribalKnowledge < 0 ||
        typeof progression.traitVisibilityUnlocked !== "boolean" ||
        (progression.equipmentSlotUpgrades !== undefined &&
            (!progression.equipmentSlotUpgrades ||
                typeof progression.equipmentSlotUpgrades !== "object" ||
                Array.isArray(progression.equipmentSlotUpgrades) ||
                Object.values(progression.equipmentSlotUpgrades).some(
                    value => !Number.isInteger(value) || value < 0
                )))
    ) {
        throw new Error("Saved tribal knowledge progression has an invalid format.");
    }

    return {
        ...progression,
        equipmentSlotUpgrades: progression.equipmentSlotUpgrades ?? {}
    };
}

let progression = loadProgression();

function saveProgression(nextProgression) {
    localStorage.setItem(
        progressionStorageKey,
        JSON.stringify(nextProgression)
    );
    progression = nextProgression;
}

export function getTribalKnowledge() {
    return progression.tribalKnowledge;
}

export function isTraitVisibilityUnlocked() {
    return progression.traitVisibilityUnlocked;
}

export function awardTribalKnowledge(amount = 1) {
    if (!Number.isInteger(amount) || amount < 1) {
        throw new Error("Tribal knowledge awards must be a positive integer.");
    }

    saveProgression({
        ...progression,
        tribalKnowledge: progression.tribalKnowledge + amount
    });
}

export function awardTraitDiscoveryKnowledge() {
    awardTribalKnowledge();
}

export function purchaseTraitVisibilityUpgrade() {
    if (progression.traitVisibilityUnlocked) {
        return "already-unlocked";
    }

    if (progression.tribalKnowledge < traitVisibilityCost) {
        return "insufficient-knowledge";
    }

    saveProgression({
        tribalKnowledge: progression.tribalKnowledge - traitVisibilityCost,
        traitVisibilityUnlocked: true
    });

    return "unlocked";
}

export function getTraitVisibilityCost() {
    return traitVisibilityCost;
}

export function getEquipmentSlotCount(zone) {
    return 1 + (progression.equipmentSlotUpgrades[zone] ?? 0);
}

export function purchaseEquipmentSlotUpgrade(zone) {
    if (progression.tribalKnowledge < equipmentSlotUpgradeCost) {
        return "insufficient-knowledge";
    }

    const equipmentSlotUpgrades = {
        ...progression.equipmentSlotUpgrades,
        [zone]: (progression.equipmentSlotUpgrades[zone] ?? 0) + 1
    };

    saveProgression({
        ...progression,
        tribalKnowledge:
            progression.tribalKnowledge - equipmentSlotUpgradeCost,
        equipmentSlotUpgrades
    });

    return "upgraded";
}
