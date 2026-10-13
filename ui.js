import { getCapacity } from "./orders.js";
import { renderWorkers } from "./workers.js";
import { gameState } from "./gameState.js";
import { hireCandidate } from "./recruitment.js";
import {
    getTribalKnowledge,
    getTraitVisibilityCost,
    isTraitVisibilityUnlocked
} from "./progression.js";
import { getWorkerTrait } from "./traits.js";
import {
    employeeCapacityUpgradeCost,
    formatZoneName,
    getEmployeeCapacity,
    getEmployeeCount,
    getAvailableHireZone
} from "./equipment.js";

export function updateUI() {
    document.getElementById("day").textContent = gameState.day;
    document.getElementById("cash").textContent = gameState.cash;
    document.getElementById("workers").textContent = gameState.workers.length;
    document.getElementById("tribalKnowledge").textContent =
        getTribalKnowledge();

    const traitVisibilityButton =
        document.getElementById("traitVisibilityButton");

    traitVisibilityButton.disabled =
        isTraitVisibilityUnlocked() ||
        getTribalKnowledge() < getTraitVisibilityCost();
    traitVisibilityButton.textContent = isTraitVisibilityUnlocked()
        ? "Pre-Hire Trait Visibility Unlocked"
        : `Unlock Pre-Hire Trait Visibility (${getTraitVisibilityCost()} TK)`;
    document.getElementById("receivingCap").textContent =
    ` (Cap ${getCapacity("receiving")})`;
    document.getElementById("storageCap").textContent =
        ` (Cap ${getCapacity("storage")})`;
    document.getElementById("pickingCap").textContent =
        ` (Cap ${getCapacity("picking")})`;
    document.getElementById("packingCap").textContent =
        ` (Cap ${getCapacity("packing")})`;
    document.getElementById("shippingCap").textContent =
        ` (Cap ${getCapacity("shipping")})`;

    ["receiving", "storage", "picking", "packing", "shipping"]
        .forEach(zone => {
            document.getElementById(`${zone}Staff`).textContent =
                `${getEmployeeCount(zone)} / ${getEmployeeCapacity(zone)} employees`;

            const upgradeButton =
                document.getElementById(`${zone}CapacityUpgrade`);

            upgradeButton.disabled =
                gameState.cash < employeeCapacityUpgradeCost;
        });

    renderWorkers("receiving","receivingWorkers");
    renderWorkers("storage","storageWorkers");
    renderWorkers("picking","pickingWorkers");
    renderWorkers("packing","packingWorkers");
    renderWorkers("shipping","shippingWorkers");

    const backlog =
    gameState.receiving.length +
    gameState.storage.length +
    gameState.picking.length +
    gameState.packing.length +
    gameState.shipping.length;

    document.getElementById("backlog").textContent =
        backlog;
}

export function log(message, type = "regular") {
    const logBox = document.getElementById("log");
    const allowedTypes = ["regular", "tk", "cash"];

    if (!allowedTypes.includes(type)) {
        throw new Error(`Unknown event notification type: ${type}`);
    }

    const notification = document.createElement("article");
    notification.className = `event-bubble event-${type}`;

    const text = document.createElement("p");
    text.textContent = message;

    const closeButton = document.createElement("button");
    closeButton.className = "event-close";
    closeButton.type = "button";
    closeButton.setAttribute("aria-label", "Dismiss notification");
    closeButton.textContent = "×";
    closeButton.addEventListener("click", () => notification.remove());

    notification.append(text, closeButton);
    logBox.appendChild(notification);
    logBox.scrollTop = logBox.scrollHeight;
}

export function showDraftScreen(candidates, onHire) {

    const modal =
        document.getElementById("draftModal");

    const candidateList =
        document.getElementById("candidateList");

    candidateList.innerHTML = "";

    gameState.draftPool.forEach(candidate => {

        const card =
            document.createElement("div");

        card.className =
            "candidateCard";

        card.innerHTML = `
            <strong>${candidate.name}</strong>
            <br>
            Productivity:
            ${candidate.productivity}
            <br>
            Reliability:
            ${candidate.reliability}
            <br>
            Morale:
            ${candidate.morale}
            <br>
        `;

        if (candidate.traitsRevealedAtHire) {
            const traits = candidate.traits.map(({ id }) => {
                const trait = getWorkerTrait(id);
                return `<strong>${trait.name}</strong><br>${trait.description}`;
            });
            card.innerHTML += `<br>${traits.join("<br><br>")}<br><br>`;
        } else {
            card.innerHTML += "<br><br>";
        }

        const button =
            document.createElement("button");

        const availableZone = getAvailableHireZone();
        button.textContent = availableZone
            ? `Hire to ${formatZoneName(availableZone)}`
            : "No Employee Slots";
        button.disabled = availableZone === null;

        button.addEventListener(
            "click",
            () => onHire(candidate)
        );

        card.appendChild(button);

        candidateList.appendChild(card);

    });

    modal.classList.remove("hidden");
}

export function closeDraftScreen() {

    document
        .getElementById("draftModal")
        .classList.add("hidden");
}