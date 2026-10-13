export function animateOrderMovement(
    order,
    destinationZoneId,
    callback
) {

    const element =
        order.element;

    const startRect =
        element.getBoundingClientRect();

    const destination =
        document.getElementById(
            destinationZoneId
        );

    const endRect =
        destination.getBoundingClientRect();

    const clone =
        element.cloneNode(true);

    clone.classList.add("moving");

    clone.style.left =
        `${startRect.left}px`;

    clone.style.top =
        `${startRect.top}px`;

    document.body.appendChild(clone);

    element.style.visibility = "hidden";

    const dx =
        endRect.left -
        startRect.left;

    const dy =
        endRect.top -
        startRect.top;

    clone.animate([
        {transform:"translate(0,0)"},
        {transform:`translate(${dx}px,${dy}px)`}
    ],{
        duration:700,
        fill:"forwards"
    });

    setTimeout(() => {

        destination.appendChild(element);

        element.style.visibility = "";

        clone.remove();

        callback?.();

    },700);
}

export function getSlotPosition(
    zoneId,
    slotIndex
) {

    const zone =
        document.getElementById(zoneId);

    const rect =
        zone.getBoundingClientRect();

    const columns = 10;

    return {

        x:
            rect.left +
            ((slotIndex % columns) * 18),

        y:
            rect.top +
            (
                Math.floor(
                    slotIndex / columns
                ) * 18
            )

    };

}