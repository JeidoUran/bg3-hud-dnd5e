# Third-Party Module Compatibility

This directory contains compatibility modules for integrating third-party Foundry VTT modules with the BG3 HUD D&D 5e adapter.

## Architecture

Each compatibility module is self-contained and follows a consistent pattern:

1. **Detection**: Check if the feature is present on an actor
2. **Normalization**: Convert the data to the HUD's standard resource format
3. **Matching**: Identify which spells/items use the resource

## Available Modules

### scgd-apothecary.js
**Module**: Sebastian Crowe's Guide to Drakkenheim (SCGD)
**Feature**: Apothecary Magic Slots

Detects and displays apothecary spell slots, similar to pact magic. Apothecary spells are automatically included in auto-population and can be filtered in the action bar.

**Detection**: `actor.system.spells.apothecary`
**Preparation Mode**: `apothecary`
**Color**: `#285348` (deep green)

## Adding New Compatibility

To add support for a new third-party module:

1. Create a new file: `<module-name>.js`
2. Export these functions:
   - `detect<Feature>(actor)` - Returns data or null
   - `normalize<Feature>(actor)` - Returns HUD resource format or null
   - `is<Feature>Spell(spell)` - Returns boolean (if applicable)
3. Register in `index.js`:
   - Import the module
   - Add to `getCompatibilitySpellSlots()` if it provides spell slots
   - Add to `getCompatibilityResourceForSpell()` if it affects spells
   - Add to `getAlwaysPreparedModes()` if spells are always prepared
4. Add localization strings to `lang/en.json`
5. Add CSS variable in core's `base.css` if custom color needed

## Resource Format

Compatibility modules should return normalized resources in this format:

```javascript
{
    id: 'spell-<type>',           // Unique identifier
    label: 'Localized Label',     // Display name
    short: 'X',                   // Short label (1-2 chars)
    classes: ['spell-level-button', 'spell-<type>-box'],
    color: '#hexcolor',           // CSS color
    data: {
        is<Type>: true,           // Type flag for filtering
        value: number,            // Current slots
        max: number,              // Maximum slots
        level: number             // Slot level (optional)
    },
    value: number,                // For slot display
    max: number                   // For slot display
}
```
