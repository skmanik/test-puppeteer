const puppeteer = require('puppeteer');

let url = "https://apps.des.wa.gov/DESContracts/Home/VendorListing";

let scrapeURLs = async(url) => {
	const browser = await puppeteer.launch({headless: true});
	const page = await browser.newPage();

	await page.goto(url);

	console.log("BIG BOB'S BEEPERS!");

	await page.select("#contractors_length select", "10");

	let allContracts = await page.evaluate(() => {
		let allRows = Array.from(document.querySelectorAll("#contractors tbody tr"));
		let allContractLinks = allRows.map(item => {
			let contract = item.querySelector("td:nth-of-type(1) a");

			if (contract.getAttribute("href")) {
				let link = "https://apps.des.wa.gov" + contract.getAttribute("href");
				return link;
			} else {
				return null;
			}
		});

		// test data
		return allContractLinks;
	});

	await browser.close();

	let docTypeKeys = new Set([
			"pricing & ordering",
			"specifications",
			"contract & amendments",
			"original solicitation documents",
			"bid tab",
			"memo to file",
			"contract comments",
			"vendor and contract performance feedback",
			"original solicitation amendments"
		]);

	for (let i = 0; i < allContracts.length; i++) {
		const result = await scrapePage(allContracts[i]);

		for (let j = 0; j < result.length; j++) {
			if (docTypeKeys.has(result[j].name) === false) {
				docTypeKeys.add(result[j].name);
			}
		}
	}

	console.log("are we done?");
	console.log(docTypeKeys);
	// return allContracts;
};

let scrapePage = async(url) => {
	const browser = await puppeteer.launch({headless: true});
	const page = await browser.newPage();

	await page.goto(url);

	console.log("i saw your face and wow!");

	let docs = await page.evaluate(() => {
		let contractTitle = document.querySelector(".body-content .row .h3").innerText;

		// ok apparently these can be labels or spans... have to find a different way
		let allLabels = Array.from(document.querySelectorAll(".form-row.d-print-none"));
		let docLabel = allLabels.find(item => {
			return item.innerText.startsWith("Current Doc");
		});

		let docSelect = Array.from(docLabel.querySelectorAll("select option"));
		let docLinks = docSelect.map(item => {
			if (item.getAttribute("value") && item.innerText) {
				return { name: item.innerText.toLowerCase(), url: item.getAttribute("value") };
			}
			return null;
		}).filter(item => {
			if (item !== null) {
				return item;
			}
		});

		// test data
		return docLinks;
	});

	// console.log(docs);

	await browser.close();
	return docs;
}

// scrapePage('https://apps.des.wa.gov/DESContracts/Home/ContractSummary/08613');
scrapeURLs(url);