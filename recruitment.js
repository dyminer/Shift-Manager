import { gameState } from "./gameState.js";
import { showDraftScreen } from "./ui.js";
import { closeDraftScreen } from "./ui.js";
import { updateUI } from "./ui.js";
import { createRandomWorkerTraits } from "./traits.js";
import { isTraitVisibilityUnlocked } from "./progression.js";
import {
    getAvailableHireZone,
    revealTraitsInZone
} from "./equipment.js";
import { log } from "./ui.js";

const names = [
    "Steve",
    "Jeff",
    "Ryan",
    "Mike",
    "Linda",
    "Sarah",
    "Chris"
];

function rand(min, max) {
    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;
}

function randomName() {

    return names[
        Math.floor(
            Math.random() *
            names.length
        )
    ];
}

export function generateDraft() {

    gameState.draftPool = [];

    for(let i=0;i<3;i++) {

        gameState.draftPool.push({

            id: Date.now() + i,

            name:
                randomName(),

            productivity:
                rand(1,10),

            reliability:
                rand(1,10),

            morale:
                rand(1,10),

            traits: createRandomWorkerTraits(),
            discoveredTraitIds: [],
            knowledgeAwardedTraitIds: [],
            traitsRevealedAtHire: isTraitVisibilityUnlocked()

        });

    }

    showDraftScreen(
        gameState.draftPool,
        hireCandidate
    );
}

export function hireCandidate(candidate) {
    const zone = getAvailableHireZone();

    if (!zone) {
        return "no-employee-slots";
    }

    candidate.zone = zone;

    gameState.workers.push(candidate);
    revealTraitsInZone(zone);

    closeDraftScreen();

    updateUI();
}

export function skipDraft() {

    gameState.cash += 250;
    log("Skipped the hiring draft and received $250.", "cash");

    closeDraftScreen();

    updateUI();
}