// originally from https://github.com/valentine195/obsidian-leaflet-plugin/blob/master/src/l10n/locale.ts
import en from "./locales/en";
import pt from "./locales/pt";

const locale = window.moment.locale;

const localeMap: { [k: string]: Partial<typeof en> } = {
	en,
	pt,
};

const userLocale = localeMap[locale()];

export default function t(str: keyof typeof en, ...inserts: string[]): string {
	let localeStr = userLocale?.[str] ?? en[str] ?? str;

	inserts.forEach(
		(insert, insertIndex) =>
			(localeStr = localeStr.replace(`%${insertIndex + 1}`, insert))
	);

	return localeStr;
}
