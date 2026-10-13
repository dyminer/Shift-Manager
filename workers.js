import { gameState } from "./gameState.js";
import { log, updateUI } from "./ui.js";
import {
    expandEmployeeCapacity,
    getEffectiveAttribute,
    getEmployeeCapacity,
    getEmployeeCount,
    formatZoneName,
    revealTraitsInZone,
    warehouseZones
} from "./equipment.js";

function moveWorkerToZone(worker, zone) {
    if (worker.zone === zone) {
        return true;
    }

    if (getEmployeeCount(zone) >= getEmployeeCapacity(zone)) {
        log(`${formatZoneName(zone)} is full. Purchase a capacity upgrade before assigning another employee there.`);
        return false;
    }

    worker.zone = zone;
    revealTraitsInZone(zone);
    updateUI();
    return true;
}

export function renderWorkers(zoneName, elementId) {

    const element =
        document.getElementById(elementId);

    element.innerHTML = "";

    gameState.workers
        .filter(w => w.zone === zoneName)
        .forEach(worker => {

            const div =
                document.createElement("span");

            div.className = "worker";
            div.draggable = true;
            div.dataset.workerId = worker.id;
            const name = document.createElement("span");
            name.textContent = `👷 ${worker.name}`;

            const tooltip = document.createElement("div");
            tooltip.className = "tooltip";
            tooltip.innerHTML = `
                Productivity: ${getEffectiveAttribute(worker, "productivity")}<br>
                Reliability: ${getEffectiveAttribute(worker, "reliability")}<br>
                Morale: ${getEffectiveAttribute(worker, "morale")}
            `;

            const moveSelect = document.createElement("select");
            moveSelect.className = "worker-move-select";
            moveSelect.setAttribute(
                "aria-label",
                `Move ${worker.name} to another area`
            );

            const prompt = document.createElement("option");
            prompt.value = "";
            prompt.textContent = "Move to area…";
            prompt.selected = true;
            prompt.disabled = true;
            moveSelect.appendChild(prompt);

            warehouseZones
                .filter(zone => zone !== worker.zone)
                .forEach(zone => {
                    const option = document.createElement("option");
                    option.value = zone;
                    option.textContent =
                        getEmployeeCount(zone) >= getEmployeeCapacity(zone)
                            ? `${formatZoneName(zone)} (Full)`
                            : formatZoneName(zone);
                    moveSelect.appendChild(option);
                });

            moveSelect.addEventListener("change", () => {
                const moved = moveWorkerToZone(worker, moveSelect.value);

                if (!moved) {
                    moveSelect.value = "";
                }
            });

            div.append(name, tooltip, moveSelect);
            element.appendChild(div);

        });

}

export function setupDragAndDrop() {

    document
    .querySelectorAll(".workerArea")
    .forEach(area => {

        

        area.addEventListener(
            "dragover",
            e => e.preventDefault()
        );

        area.addEventListener(
            "drop",
            e => {

                const zone =
                    area.dataset.zone;

                const worker = gameState.workers.find(
                    w => w.id === gameState.draggedWorkerId
                );

                if (worker) {
                    moveWorkerToZone(worker, zone);
                }

            });

    });
    
    document.addEventListener("dragstart", e => {

    if(e.target.classList.contains("worker")) {

        gameState.draggedWorkerId =
            Number(e.target.dataset.workerId);

    }

});

}

export function assignWorker(zone) {

    const idleWorker =
        gameState.workers[gameState.workers.length - 1];

    if (getEmployeeCount(zone) >= getEmployeeCapacity(zone)) {
        log(`${formatZoneName(zone)} is at its employee capacity.`);
        return;
    }

    idleWorker.zone = zone;
    revealTraitsInZone(zone);

    updateUI();

}

export function upgradeAreaCapacity(zone) {
    const result = expandEmployeeCapacity(zone);

    if (result === "upgraded") {
        log(`${formatZoneName(zone)} employee capacity increased by 1 for $500.`, "cash");
    } else {
        log("Not enough cash to increase employee capacity.", "cash");
    }

    updateUI();
}