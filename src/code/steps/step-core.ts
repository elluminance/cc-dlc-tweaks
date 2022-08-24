import actionStep from "./action-step.js"
import effectEntry from "./effect-entry.js"
import eventStep from "./event-step.js"

export default function() {
    actionStep();
    effectEntry();
    eventStep();
}