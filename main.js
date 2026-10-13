import { log, updateUI } from "./ui.js";
import { setupDragAndDrop, upgradeAreaCapacity } from "./workers.js";
import { nextDay } from "./simulation.js";
import {
    openERP,
    closeERP,
    openEquipmentShop,
    showEmployeeSection
} from "./erp.js";
import { purchaseTraitVisibilityUpgrade } from "./progression.js";
import { warehouseZones } from "./equipment.js";
document
    .getElementById("nextDayButton")
    .addEventListener("click", nextDay);

document
    .getElementById("erpButton")
    .addEventListener("click", openERP);
document
    .getElementById("closeERP")
    .addEventListener("click", closeERP);

document
    .getElementById("employeeTab")
    .addEventListener("click", showEmployeeSection);

document
    .getElementById("equipmentTab")
    .addEventListener("click", openEquipmentShop);

warehouseZones.forEach(zone => {
    document
        .getElementById(`${zone}CapacityUpgrade`)
        .addEventListener("click", () => upgradeAreaCapacity(zone));
});

document
    .getElementById("traitVisibilityButton")
    .addEventListener("click", () => {
        const result = purchaseTraitVisibilityUpgrade();

        if (result === "unlocked") {
            log("Permanent progression unlocked: worker traits are visible before hiring for 5 TK.", "tk");
        } else if (result === "insufficient-knowledge") {
            log("Not enough tribal knowledge to unlock pre-hire trait visibility.", "tk");
        }

        updateUI();
    });

setupDragAndDrop();
updateUI();