import { gameState }
from "./gameState.js";
import { getWorkerTrait } from "./traits.js";
import { getEquipmentBonus } from "./equipment.js";

export function createOrderElement(order, color) {
    const div =
        document.createElement("div");

    div.className = "order";

    div.id = `order-${order.id}`;

    order.element = div;

    return div;
}

export function createOrderDom(order) {

    const div =
        document.createElement("div");

    div.className = "order";

    div.id =
        `order-${order.id}`;

    return div;

}

export function moveOrder(
    order,
    fromArray,
    toArray,
    destinationZoneId
) {

    const index =
        fromArray.indexOf(order);

    if(index !== -1) {
        fromArray.splice(index,1);
    }

    toArray.push(order);

    order.zone = destinationZoneId;
}

export function getCapacity(zone, onTraitDiscovered) {
    const workers = gameState.workers.filter(
        worker => worker.zone === zone
    );

    let capacity = 0;

    workers.forEach(worker => {
        worker.traits ??= [];
        worker.discoveredTraitIds ??= [];
        worker.knowledgeAwardedTraitIds ??= [];
        let productivity =
            worker.productivity + getEquipmentBonus(zone, "productivity");

        worker.traits.forEach(({ id }) => {
            const trait = getWorkerTrait(id);
            const isActive =
                (trait.kind === "area" && trait.zone === zone) ||
                (trait.kind === "coworker" && workers.length > 1);

            if (!isActive) {
                return;
            }

            if (onTraitDiscovered) {
                if (!worker.discoveredTraitIds.includes(id)) {
                    worker.discoveredTraitIds.push(id);
                }

                if (!worker.knowledgeAwardedTraitIds.includes(id)) {
                    onTraitDiscovered(worker, trait);
                    worker.knowledgeAwardedTraitIds.push(id);
                }
            }

            if (trait.kind === "area") {
                productivity += trait.productivityBonus;
            } else if (trait.benefit === "self-per-coworker") {
                productivity += trait.productivityBonus * (workers.length - 1);
            }
        });

        workers.forEach(coworker => {
            if (coworker === worker) {
                return;
            }

            coworker.traits.forEach(({ id }) => {
                const trait = getWorkerTrait(id);

                if (
                    trait.kind === "coworker" &&
                    trait.benefit === "coworkers"
                ) {
                    productivity += trait.productivityBonus;
                }
            });
        });

        capacity += productivity * 2;
    });

    return capacity;
}
