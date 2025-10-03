import { AutoPopulateFramework } from '../../../bg3-hud-core/scripts/features/AutoPopulateFramework.js';

/**
 * D&D 5e Auto Populate Implementation
 * Provides D&D 5e-specific item filtering and population logic
 */
export class DnD5eAutoPopulate extends AutoPopulateFramework {
    /**
     * Get D&D 5e item type choices (grouped)
     * @returns {Promise<Array<{group: string, choices: Array<{value: string, label: string}>}>>}
     */
    async getItemTypeChoices() {
        return [
            {
                group: 'Combat',
                choices: [
                    { value: 'weapon', label: 'Weapons' },
                    { value: 'feat', label: 'Features & Actions' },
                    { value: 'spell', label: 'Spells' }
                ]
            },
            {
                group: 'Consumables',
                choices: [
                    { value: 'consumable:ammo', label: 'Ammunition' },
                    { value: 'consumable:potion', label: 'Potions' },
                    { value: 'consumable:poison', label: 'Poisons' },
                    { value: 'consumable:scroll', label: 'Scrolls' },
                    { value: 'consumable:food', label: 'Food & Drink' }
                ]
            },
            {
                group: 'Wondrous',
                choices: [
                    { value: 'equipment', label: 'Equipment' },
                    { value: 'consumable:wand', label: 'Wands' },
                    { value: 'consumable:rod', label: 'Rods' },
                    { value: 'consumable:trinket', label: 'Trinkets' }
                ]
            },
            {
                group: 'Other',
                choices: [
                    { value: 'tool', label: 'Tools' },
                    { value: 'loot', label: 'Loot' }
                ]
            }
        ];
    }

    /**
     * Get items from actor that match selected types
     * Includes D&D 5e-specific filtering (spell preparation, activities, etc.)
     * @param {Actor} actor - The actor
     * @param {Array<string>} selectedTypes - Selected type values
     * @returns {Promise<Array<{uuid: string}>>}
     */
    async getMatchingItems(actor, selectedTypes) {
        const items = [];

        for (const item of actor.items) {
            // Check if item matches any selected type
            if (!this._matchesType(item, selectedTypes)) {
                continue;
            }

            // For spells, check preparation state
            if (item.type === 'spell' && !this._isSpellUsable(actor, item)) {
                continue;
            }

            // Check if item has activities or is usable
            if (!this._hasActivities(item)) {
                continue;
            }

            items.push({ uuid: item.uuid });
        }

        return items;
    }

    /**
     * Check if item matches any of the selected types
     * @param {Item} item - The item to check
     * @param {Array<string>} selectedTypes - Selected type values
     * @returns {boolean}
     * @private
     */
    _matchesType(item, selectedTypes) {
        for (const selectedType of selectedTypes) {
            if (selectedType.includes(':')) {
                // Handle subtype (e.g., "consumable:potion")
                const [mainType, subType] = selectedType.split(':');
                if (item.type === mainType && item.system?.type?.value === subType) {
                    return true;
                }
            } else {
                // Handle main type (e.g., "weapon")
                if (item.type === selectedType) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Check if spell is usable (prepared, always prepared, etc.)
     * @param {Actor} actor - The actor
     * @param {Item} item - The spell item
     * @returns {boolean}
     * @private
     */
    _isSpellUsable(actor, item) {
        // Get spell preparation method
        const method = item.system?.method ?? item.system?.preparation?.mode;
        const prepared = item.system?.prepared ?? item.system?.preparation?.prepared;

        // Always include these spell types
        const alwaysInclude = ['pact', 'apothecary', 'atwill', 'innate', 'ritual', 'always'];
        if (alwaysInclude.includes(method)) {
            return true;
        }

        // For "prepared" spells, check if they're actually prepared
        if (method === 'prepared') {
            return prepared === true;
        }

        // Include other spell types if they're prepared
        return prepared === true;
    }

    /**
     * Check if item has activities or is usable
     * @param {Item} item - The item to check
     * @returns {boolean}
     * @private
     */
    _hasActivities(item) {
        const activities = item.system?.activities;
        
        // D&D 5e v4+: Check if activities Map has entries
        if (activities instanceof Map) {
            return activities.size > 0;
        }

        // D&D 5e v3 fallback: Check activation type
        if (item.system?.activation?.type && item.system.activation.type !== 'none') {
            return true;
        }

        // Weapons and equipment are generally usable
        if (item.type === 'weapon' || item.type === 'equipment') {
            return true;
        }

        return false;
    }
}

