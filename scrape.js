const puppeteer = require('puppeteer');

// temp, testing individual contract page
// note: will get contract ID, vendor name, and diversity info from vendor listings page
// in a separate script

// note: https://www.npmjs.com/package/uuidv4

let url = "https://apps.des.wa.gov/DESContracts/Home/ContractSummary/08613";

let scrape = async(url) => {
	const browser = await puppeteer.launch({headless: false});
	const page = await browser.newPage();

	await page.goto(url);

	// testing grab data
	const test = await page.evaluate(() => {
		let foo = document.querySelector(".body-content .row .h3").innerText;
		return foo;
    });

    console.log(test);
}

scrape(url);

// still not sure where you specify async in regards to page.evaluate()
// does each selector grab really need its own await page.evaluate() function ??

// resources:
// https://github.com/CodeDraken/puppeteer-example/blob/master/index.js
// https://medium.com/@e_mad_ehsan/getting-started-with-puppeteer-and-chrome-headless-for-web-scrapping-6bf5979dee3e
// https://github.com/emadehsan/thal/blob/master/index.js#L34
// puppeteer API https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pageevalselector-pagefunction-args