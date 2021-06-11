export default function isEnabled (config: { features: any }, fn: string): boolean {
	let invert = false;

	if (fn[0] == '!') {
		fn = fn.substring (1);
		invert = true;
	}

	if (fn in config.features && config.features[fn] && !invert)
		return true;
	else if (fn in config.features && !config.features[fn] && !invert)
		return false;
	else
		return true;
};

