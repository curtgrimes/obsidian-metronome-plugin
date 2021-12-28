# Localization

The plugin has full localization support, and will attempt to load the current Obsidian locale. If one does not exist, it will fall back to English.

## Adding a new locale

New locales can be added by creating a pull request. Two things should be done in this pull request:

1. Create the locale in the `locales` folder by copying the `en.ts` file. This file should be given a name matching the [ISO 639-1](https://www.loc.gov/standards/iso639-2/php/English_list.php) code for that language.
1. Create the translation by editing the value of each property.
1. Add the import in `locales.ts`.
1. Add the language to the `localeMap` variable.

## Wildcards

Some strings in the locale may have wildcards in them, such as `%1`. This is used by the plugin to insert dynamic data into the translated string.

For example:

`Loading RSS Reader v%1`: The plugin will insert the version number for `%1`.

---

This i18n guide was inspired from the [obsidian-leaflet-plugin](https://github.com/valentine195/obsidian-leaflet-plugin/blob/master/src/l10n/README.md) project.
