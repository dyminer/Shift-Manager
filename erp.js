import { gameState } from "./gameState.js";
import { getWorkerTrait } from "./traits.js";
import { log, updateUI } from "./ui.js";
import {
    equipmentCatalog,
    getEffectiveAttribute,
    getEquipmentById,
    getEquipmentInZone,
    getEquipmentSlotLimit,
    formatZoneName,
    purchaseEquipment,
    upgradeEquipmentSlots,
    warehouseZones
} from "./equipment.js";
import {
    equipmentSlotUpgradeCost,
    getTribalKnowledge
} from "./progression.js";

export function openERP() {

    const modal =
        document.getElementById("erpModal");

    modal.classList.remove("hidden");

    showEmployeeSection();
}

export function closeERP() {

    const modal =
        document.getElementById("erpModal");
        
modal.classList.add("hidden");
}

export function renderEmployeeList() {

    const employeeList =
        document.getElementById("employeeList");

    employeeList.innerHTML = "";

    gameState.workers.forEach(worker => {

        const row =
            document.createElement("div");

        row.className =
            "employeeRow";

        row.textContent =
            worker.name;

        row.addEventListener(
            "click",
            () => showEmployeeProfile(worker.id)
        );

        employeeList.appendChild(row);
    });
}

export function showEmployeeSection() {
    document.getElementById("employeeWorkspace").classList.remove("hidden");
    document.getElementById("equipmentShop").classList.add("hidden");
    renderEmployeeList();
}

export function openEquipmentShop() {
    document.getElementById("employeeWorkspace").classList.add("hidden");
    document.getElementById("equipmentShop").classList.remove("hidden");
    renderEquipmentShop();
}

function makeTextElement(tagName, text, className) {
    const element = document.createElement(tagName);
    element.textContent = text;

    if (className) {
        element.className = className;
    }

    return element;
}

export function renderEquipmentShop(selectedZone = "receiving") {
    const shop = document.getElementById("equipmentShop");
    shop.replaceChildren();

    const header = makeTextElement("div", "", "equipmentShopHeader");
    header.appendChild(makeTextElement("div", "WAREHOUSE UPGRADES", "eyebrow"));
    header.appendChild(makeTextElement("h2", "Equipment Shop"));
    header.appendChild(makeTextElement(
        "p",
        "Fit out each area with tools that improve your operation.",
        "equipmentShopDescription"
    ));

    const balances = makeTextElement("div", "", "equipmentBalances");
    balances.append(
        makeTextElement("span", `Cash  $${gameState.cash}`, "equipmentBalance cash-balance"),
        makeTextElement(
            "span",
            `Tribal Knowledge  ${getTribalKnowledge()} TK`,
            "equipmentBalance tk-balance"
        )
    );
    header.appendChild(balances);
    shop.appendChild(header);

    const areaSelect = document.createElement("select");
    areaSelect.id = "equipmentAreaSelect";

    warehouseZones.forEach(zone => {
        const option = document.createElement("option");
        option.value = zone;
        option.textContent = formatZoneName(zone);
        option.selected = zone === selectedZone;
        areaSelect.appendChild(option);
    });

    areaSelect.addEventListener("change", () => {
        renderEquipmentShop(areaSelect.value);
    });

    const selectedItems = getEquipmentInZone(selectedZone);
    const slotLimit = getEquipmentSlotLimit(selectedZone);

    const areaPanel = makeTextElement("section", "", "equipmentArea");
    const areaPanelHeading = makeTextElement("div", "", "equipmentAreaHeading");
    const areaLabel = makeTextElement("label", "Install in area", "equipmentFieldLabel");
    areaLabel.htmlFor = areaSelect.id;
    areaLabel.appendChild(areaSelect);
    areaPanelHeading.append(
        areaLabel,
        makeTextElement(
            "span",
            `${selectedItems.length} / ${slotLimit} slots used`,
            "equipmentSlotCount"
        )
    );
    areaPanel.appendChild(areaPanelHeading);

    const installedEquipment = makeTextElement(
        "div",
        "",
        "installedEquipment"
    );
    installedEquipment.appendChild(makeTextElement(
        "strong",
        `${formatZoneName(selectedZone)} setup`
    ));

    if (selectedItems.length === 0) {
        installedEquipment.appendChild(makeTextElement(
            "p",
            "No equipment installed yet."
        ));
    } else {
        selectedItems.forEach(({ id }) => {
            installedEquipment.appendChild(makeTextElement(
                "span",
                getEquipmentById(id).name,
                "installedEquipmentTag"
            ));
        });
    }
    areaPanel.appendChild(installedEquipment);

    const slotUpgradeButton = document.createElement("button");
    slotUpgradeButton.className = "equipmentSlotUpgrade";
    slotUpgradeButton.textContent =
        `Add permanent slot · ${equipmentSlotUpgradeCost} TK`;
    slotUpgradeButton.disabled =
        getTribalKnowledge() < equipmentSlotUpgradeCost;
    slotUpgradeButton.addEventListener("click", () => {
        const result = upgradeEquipmentSlots(selectedZone);

        if (result === "upgraded") {
            log(`Permanently unlocked another equipment slot in ${formatZoneName(selectedZone)} for ${equipmentSlotUpgradeCost} TK.`, "tk");
        } else {
            log("Not enough TK to unlock an equipment slot.", "tk");
        }

        updateUI();
        renderEquipmentShop(selectedZone);
    });
    areaPanel.appendChild(slotUpgradeButton);
    shop.appendChild(areaPanel);

    shop.appendChild(makeTextElement(
        "h3",
        "Available equipment",
        "equipmentSectionTitle"
    ));

    const shopList = makeTextElement("div", "", "equipmentGrid");
    equipmentCatalog.forEach(equipment => {
        const card = makeTextElement("section", "", "equipmentCard");
        const category = equipment.revealsTraits
            ? "Discovery"
            : equipment.tribalKnowledgePerDay
                ? "Knowledge"
                : "Area upgrade";
        card.appendChild(makeTextElement(
            "span",
            category,
            "equipmentCategory"
        ));
        card.appendChild(makeTextElement("h3", equipment.name));
        card.appendChild(makeTextElement(
            "p",
            equipment.description,
            "equipmentDescription"
        ));

        const purchaseRow = makeTextElement("div", "", "equipmentPurchaseRow");
        purchaseRow.appendChild(makeTextElement(
            "strong",
            `$${equipment.price}`,
            "equipmentPrice"
        ));
        const purchaseButton = document.createElement("button");
        purchaseButton.className = "equipmentPurchaseButton";
        purchaseButton.textContent = "Buy & install";
        purchaseButton.disabled =
            selectedItems.length >= slotLimit ||
            gameState.cash < equipment.price;
        purchaseButton.title = selectedItems.length >= slotLimit
            ? `No equipment slots are available in ${formatZoneName(selectedZone)}.`
            : gameState.cash < equipment.price
                ? "Not enough cash."
                : `Install ${equipment.name} in ${formatZoneName(selectedZone)}.`;
        purchaseButton.addEventListener("click", () => {
            const result = purchaseEquipment(equipment.id, selectedZone);

            if (result === "purchased") {
                log(`${equipment.name} installed in ${formatZoneName(selectedZone)} for $${equipment.price}.`, "cash");
            } else if (result === "insufficient-cash") {
                log("Not enough cash to purchase that equipment.", "cash");
            } else {
                log(`No equipment slots are available in ${formatZoneName(selectedZone)}.`);
            }

            updateUI();
            renderEquipmentShop(selectedZone);
        });

        purchaseRow.appendChild(purchaseButton);
        card.appendChild(purchaseRow);
        shopList.appendChild(card);
    });

    shop.appendChild(shopList);
}

export function showEmployeeProfile(workerId) {

    const worker =
        gameState.workers.find(
            w => w.id === workerId
        );

    if (!worker) {
        return;
    }

    const profile =
        document.getElementById(
            "employeeProfile"
        );

    worker.traits ??= [];
    worker.discoveredTraitIds ??= [];
    const visibleTraits = worker.traits
        .filter(({ id }) =>
            worker.discoveredTraitIds.includes(id) ||
            worker.traitsRevealedAtHire
        )
        .map(({ id }) => {
            const trait = getWorkerTrait(id);
            return `<p><strong>${trait.name}</strong>: ${trait.description}</p>`;
        });
    const discoveredTraitCount = worker.discoveredTraitIds.length;

    profile.innerHTML = `
        <h2>${worker.name}</h2>

        <p>
            <strong>Department:</strong>
            ${formatZoneName(worker.zone)}
        </p>

        <p>
            <strong>Productivity:</strong>
            ${getEffectiveAttribute(worker, "productivity") ?? "?"}
        </p>

        <p>
            <strong>Reliability:</strong>
            ${getEffectiveAttribute(worker, "reliability") ?? "?"}
        </p>

        <p>
            <strong>Morale:</strong>
            ${getEffectiveAttribute(worker, "morale") ?? "?"}
        </p>

        <hr>

        <h3>Traits</h3>
        <p>${worker.traits.length} traits total; ${discoveredTraitCount} discovered through work.</p>
        ${visibleTraits.length > 0
            ? visibleTraits.join("")
            : "<p>No traits discovered yet.</p>"}

        <h3>Performance Notes</h3>
        <p>No notes recorded.</p>
    `;
}
