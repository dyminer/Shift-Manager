import { gameState } from "./gameState.js";
import { log, updateUI } from "./ui.js";
import {
    expandEmployeeCapacity,
    getEffectiveAttribute,
    getEmployeeCapacity,
    getEmployeeCount,
    formatZoneName,
    revealTraitsInZone
} from "./equipment.js";

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
            div.innerHTML = `
                👷 ${worker.name}
                <div class="tooltip">
                    Productivity: ${getEffectiveAttribute(worker, "productivity")}<br>
                    Reliability: ${getEffectiveAttribute(worker, "reliability")}<br>
                    Morale: ${getEffectiveAttribute(worker, "morale")}
                </div>
                `;
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

                const worker =
                    gameState.workers.find(
                        w => w.id === gameState.draggedWorkerId
                    );

                if (!worker) return;

                if (
                    worker.zone !== zone &&
                    getEmployeeCount(zone) >= getEmployeeCapacity(zone)
                ) {
                    log(`${formatZoneName(zone)} is full. Purchase a capacity upgrade before assigning another employee there.`);
                    return;
                }
                
                worker.zone = zone;
                revealTraitsInZone(zone);

                updateUI();

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