const puppeteer = require('puppeteer');

// temp, testing individual contract page
// note: will get contract ID, vendor name, and diversity info from vendor listings page
// in a separate script

// note: https://www.npmjs.com/package/uuidv4

let url = "https://apps.des.wa.gov/DESContracts/Home/ContractSummary/08613";

let scrape = async(url) => {
	const browser = await puppeteer.launch({headless: true});
	const page = await browser.newPage();

	await page.goto(url);

	console.log("here lies squidward's hopes and dreams");

	// testing grab data.
	// apparently everything that happens in this evalute function happens in the browser

	let testData = await page.evaluate(() => {
		// get contract title
		let contractTitle = document.querySelector(".body-content .row .h3").innerText;
		
		// get start date and end date by searching span tags with class label
		let allSpans = Array.from(document.querySelectorAll("span.label"));
		let relevantSpans = allSpans.map(item => {
			return item.parentElement.innerText;
		});

		let contractDates = relevantSpans.filter(item => {
			return item.startsWith("Current Term");
		}).map(item => {
			return item.split(": ")[1];
		});

		// get contact info for buyers (include test to find "SECONDARY")
		let contactOne = allSpans.filter(item => {
			return item.innerText.startsWith("Contact");
		}).map(item => {
			return item.parentElement.parentElement.innerText;
		});

		return contactOne;
    });

	console.log("testing");
    console.log(testData);

    browser.close();
}

scrape(url);

// still not sure where you specify async in regards to page.evaluate()
// does each selector grab really need its own await page.evaluate() function ??

// resources:
// https://github.com/CodeDraken/puppeteer-example/blob/master/index.js
// https://medium.com/@e_mad_ehsan/getting-started-with-puppeteer-and-chrome-headless-for-web-scrapping-6bf5979dee3e
// https://github.com/emadehsan/thal/blob/master/index.js#L34
// puppeteer API https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pageevalselector-pagefunction-args
// Aaron's example: https://github.com/CoProcure/scrape-contracts/blob/master/sourcewell/get-contracts.js