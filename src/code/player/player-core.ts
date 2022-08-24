import modifier from "./modifier.js"
import toggleSets from "./toggle-sets.js"
import playerConfig from "./player-config.js"
import inventory from "./inventory.js";

export default function() {
    modifier();
    toggleSets();
    playerConfig();
    inventory();
}