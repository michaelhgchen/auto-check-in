const puppeteer = require('puppeteer');

const CHECKIN_URL = 'https://www.southwest.com/air/check-in/index.html';
const TYPING_DELAY = 20;

const browserConfig = process.env.NODE_ENV === 'production' ?
  {} : {
    headless: false,
    slowMo: 250
  };

export async function checkInManually(token, firstName, lastName) {
  const browser = await puppeteer.launch(browserConfig);

  const page = await browser.newPage();
  await page.goto(CHECKIN_URL);

  await page.type('input#confirmationNumber', token, { delay: TYPING_DELAY });
  await page.type('input#passengerFirstName', firstName, { delay: TYPING_DELAY });
  await page.type('input#passengerLastName', lastName, { delay: TYPING_DELAY });

  await Promise.all([
    page.waitForNavigation(),
    page.$eval('form.confirmation-number-form', form => form.submit()),
  ]);

  await browser.close();
}
