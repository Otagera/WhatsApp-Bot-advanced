const fs = require("fs/promises");

class Needlecasting {
	#getText;
	#sendMessage;
	#dataFile;
	#prefix;

	constructor(config = {}) {
		this.#dataFile = config.dataFile || "./needlecast.json";
		this.#prefix = config.prefix || "!needlecast ";
	}

	init(socket, getText, sendMessage) {
		this.#getText = getText;
		this.#sendMessage = sendMessage;
	}

	#needlecastHelp(key, message) {
		this.#sendMessage(
			key.remoteJid,
			{
				text: `[NEEDLECAST HELP]\n
        Brief on needlecaster: !needlecast brief
        Details on needlecaster: !needlecast detailed\n
        Yup, that's all :)
        `,
			},
			{ quoted: { key, message } }
		);
	}

	#briefOnNeedlecasts(needlecasts) {
		let totalNoOfNeedlecasters = 0;
		let totalAmountDonated = 0;
		let formattedString = `[Needlecasts Brief Summary] \n
		`;

		for(let index in needlecasts){
			totalNoOfNeedlecasters++;
			totalAmountDonated += +needlecasts[index].amount;
		}
		formattedString += `
			Total number of needlecasters: ${totalNoOfNeedlecasters}
			Total amount donated: ${totalAmountDonated}
		`;
		return formattedString;
	}

	#formatNeedlecast(needlecasts) {
		let totalNoOfNeedlecasters = 0;
		let totalAmountDonated = 0;
		let formattedString = `[All Needlecasts] \n
		`;

		for(let index in needlecasts){
			totalNoOfNeedlecasters++;
			totalAmountDonated += +needlecasts[index].amount;

			formattedString += `
				Needlecaster: ${needlecasts[index].needlecaster}
				Message: ${needlecasts[index].message}
				Date: ${needlecasts[index].date}
			`;
			formattedString += "\n";
		}
		formattedString += `
			Total number of needlecasters: ${totalNoOfNeedlecasters}
			Total amount donated: ${totalAmountDonated}
		`;
		return formattedString;
	}

	#listNeedlecasts(key, message, needlecasts) {
		this.#sendMessage(
			key.remoteJid,
			{ text: `${this.#briefOnNeedlecasts(needlecasts)}` },
			{ quoted: { key, message } }
		);
	}

	#detailedListNeedlecasts(key, message, needlecasts) {
		this.#sendMessage(
			key.remoteJid,
			{ text: `${this.#formatNeedlecast(needlecasts)}` },
			{ quoted: { key, message } }
		);
	}

	async process(key, message) {
		let text = this.#getText(key, message).toLowerCase();

		let needlecasts;
		try {
			const needlecastsData = await fs.readFile(this.#dataFile);
			needlecasts = JSON.parse(needlecastsData);
		} catch {
			needlecasts = [];
		}

		if (!text.startsWith(this.#prefix)) return;
		if (!needlecasts?.needlecasts) return;
		text = text.slice(this.#prefix.length).toLowerCase();

		const items = text.split(" ");

		if (items[0] === "help") {
			this.#needlecastHelp(key, message);
		} else if (items[0] === "brief") {
			this.#listNeedlecasts(key, message, needlecasts.needlecasts);
		} else if (items[0] === "detailed") {
			this.#detailedListNeedlecasts(key, message, needlecasts.needlecasts);
		}

		await fs.writeFile(this.#dataFile, JSON.stringify(needlecasts, null, "\t"));
	}
}

module.exports = Needlecasting;
