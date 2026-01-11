/**
 * Third-Party Module Compatibility Registry
 *
 * Coordinates all 3rd-party compatibility integrations for bg3-hud-dnd5e.
 * Each compatibility module is self-contained and gracefully handles
 * the absence of its target module.
 *
 * @module compatibility
 */

import * as SCGDApothecary from './scgd-apothecary.js';

/**
 * All registered compatibility modules
 */
const COMPATIBILITY_MODULES = {
    'scgd-apothecary': SCGDApothecary
};

/**
 * Get additional spell slots from all active compatibility modules
 * @param {Actor5e} actor - The D&D 5e actor
 * @returns {Array<Object>} Additional normalized spell slot resources
 */
export function getCompatibilitySpellSlots(actor) {
    const slots = [];

    // SCGD Apothecary Magic
    const apothecarySlot = SCGDApothecary.normalizeApothecarySlots(actor);
    if (apothecarySlot) {
        slots.push(apothecarySlot);
    }

    // Future: Add more compatibility modules here

    return slots;
}

/**
 * Check if spell uses any compatibility-provided resource
 * @param {Item5e} spell - The spell item
 * @returns {string|null} Resource ID (e.g., 'apothecary') or null
 */
export function getCompatibilityResourceForSpell(spell) {
    // Check SCGD
    if (SCGDApothecary.isApothecarySpell(spell)) {
        return 'apothecary';
    }

    // Future: Check other modules

    return null;
}

/**
 * Get list of preparation modes that are always prepared (from compatibility modules)
 * @returns {Array<string>} Array of preparation mode strings
 */
export function getAlwaysPreparedModes() {
    return [
        'apothecary' // SCGD apothecary spells are always available when you have slots
        // Future: Add more from other modules
    ];
}
