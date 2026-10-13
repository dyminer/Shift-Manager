import {
    gameState,
} from "./gameState.js";

import {
    createOrderElement,
    moveOrder,
    getCapacity
} from "./orders.js";

import { animateOrderMovement }
from "./animation.js";

import {
    updateUI,
    log
} from "./ui.js";

import { 
    generateDraft 
} from "./recruitment.js";
import {
    awardTraitDiscoveryKnowledge,
    awardTribalKnowledge
} from "./progression.js";
import {
    generatePassiveTribalKnowledge,
    revealTraitsInZone
} from "./equipment.js";

function getCapacityForWork(zone, orders) {
    const onTraitDiscovered = orders.length > 0
        ? (worker, trait) => {
            awardTraitDiscoveryKnowledge();
            log(`${worker.name} discovered ${trait.name} and earned 1 TK.`, "tk");
        }
        : undefined;

    return getCapacity(zone, onTraitDiscovered);
}

export function nextDay() {
    gameState.day++;

    const passiveKnowledge = generatePassiveTribalKnowledge();

    if (passiveKnowledge > 0) {
        awardTribalKnowledge(passiveKnowledge);
        log(`Equipment generated ${passiveKnowledge} TK.`, "tk");
    }

    ["receiving", "storage", "picking", "packing", "shipping"]
        .forEach(revealTraitsInZone);

    if(gameState.day % 7 === 0) {
            generateDraft();
        }

    // New orders arrive at receiving
    const newOrders = Math.floor(Math.random() * 6) + 5;

    for(let i = 0; i < newOrders; i++) {

    const order = {
    id: gameState.nextOrderId++,
    zone: "receiving",
    element: null
    };

    gameState.receiving.push(order);

    document
        .getElementById("receivingZone")
        .appendChild(
            createOrderElement(order)
        );
    }

// Move shipping to completed
    let shipped = Math.min(
    gameState.shipping.length,
    getCapacityForWork("shipping", gameState.shipping)
    );

    const ordersToShip =
     gameState.shipping.slice(0, shipped);

    for(const order of ordersToShip) {

        const index =
            gameState.shipping.indexOf(order);

        if(index !== -1) {
            gameState.shipping.splice(index, 1);
        }

        order.element.remove();

        gameState.completed++;
        gameState.cash += 50;
    }

    if (shipped > 0) {
        log(`Shipped ${shipped} orders and earned $${shipped * 50}.`, "cash");
    }

// Move packing to shipping
    let packed = Math.min(
    gameState.packing.length,
    getCapacityForWork("packing", gameState.packing)
    );

    const ordersToPack = gameState.packing.slice(0, packed);

    for(const order of ordersToPack) {

        animateOrderMovement(
            order,
            "shippingZone",
            () => {

        moveOrder(
            order,
            gameState.packing,
            gameState.shipping,
            "shipping"
        );

        }
    );

}

// Move picking to packing
    let picked = Math.min(
        gameState.picking.length,
        getCapacityForWork("picking", gameState.picking)
    );

    const ordersToPick = gameState.picking.slice(0, picked);

    for(const order of ordersToPick) {

        animateOrderMovement(
            order,
            "packingZone",
            () => {

        moveOrder(
            order,
            gameState.picking,
            gameState.packing,
            "packing"
        );

        }
    );
}
        
// Move storage to picking
    let moved = Math.min(
        gameState.storage.length,
        getCapacityForWork("storage", gameState.storage)
    );

    const ordersToStore = gameState.storage.slice(0, moved);

    for(const order of ordersToStore) {

        animateOrderMovement(
            order,
            "pickingZone",
            () => {

        moveOrder(
            order,
            gameState.storage,
            gameState.picking,
            "picking"
        );

        }
    );

}

//Move receiving to storage
    let received = Math.min(
        gameState.receiving.length,
        getCapacityForWork("receiving", gameState.receiving)
    );

    const ordersToMove =
        gameState.receiving.slice(0, received);

    for (const order of ordersToMove) {

        animateOrderMovement(
            order,
            "storageZone",
            () => {

                moveOrder(
                    order,
                    gameState.receiving,
                    gameState.storage,
                    "storage"
                );

            }
        );
    }

    log(
        `Day ${gameState.day}
        | Orders Arrived: ${newOrders}
        | Received: ${received}
        | Shipped: ${shipped}`
    );

    let totalBacklog =
    gameState.receiving.length +
    gameState.storage.length +
    gameState.picking.length +
    gameState.packing.length +
    gameState.shipping.length;

    if (gameState.receiving.length > gameState.workers.length * 10) {
        log("📦 Receiving docks are overloaded.");
    }

    if (gameState.shipping.length > gameState.workers.length * 10) {
        log("🚚 Shipping area is congested.");
    }

    if (totalBacklog > 100) {
        alert("Game Over: Warehouse collapsed under backlog.");
        location.reload();
        return;
    }

    setTimeout(() => {
        updateUI();
    }, 700);
}
