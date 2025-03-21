import { test, expect } from '@playwright/test';
import {SmallLoanPage} from "../page-objects/pages/SmallLoanPage";
import {LoanDecisionPage} from "../page-objects/pages/LoanDecisionPage";

test.describe('Loan app mock tests', async () => {
    test('TL-21-1 positive test', async ({page}) => {
        const expectedMonthlyAmount = 100000;
        const smallLoanPage = new SmallLoanPage(page);

        await page.route("**/api/loan-calc*", async (request) => {
            const responseBody = {paymentAmountMonthly: expectedMonthlyAmount};
            await request.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(responseBody),
            });
        });
        const loanCalcResponse = page.waitForResponse("**/api/loan-calc*");
        await page.goto("http://localhost:3000");
        await loanCalcResponse;
        await smallLoanPage.checkMonthlyAmount(expectedMonthlyAmount);

    });

    test('TL-21-2 Verify response code 500 and no response body', async ({page}) => {
        const smallLoanPage = new SmallLoanPage(page);

        await page.route("**/api/loan-calc*", async (request) => {
            await request.fulfill({
                status: 500,
                contentType: 'application/json',
            });
        });
        const loanCalcResponse = page.waitForResponse("**/api/loan-calc*");
        await smallLoanPage.open();
        await loanCalcResponse;
        await smallLoanPage.checkErrorMessage();
    });

    test('TL-21-3 Verify response code 200 and no response body', async ({page}) => {
        const smallLoanPage = new SmallLoanPage(page);

        await page.route("**/api/loan-calc*", async (request) => {
            await request.fulfill({
                status: 200,
                contentType: 'application/json',
            });
        });
        const loanCalcResponse = page.waitForResponse("**/api/loan-calc*");
        await smallLoanPage.open();
        await loanCalcResponse;
        await smallLoanPage.checkPaymentUndefined();

    });

    test('TL-21-4 Verify response code 200 and not correct name of a body key', async ({page}) => {
        const smallLoanPage = new SmallLoanPage(page);

        await page.route("**/api/loan-calc*", async (request) => {
            const responseBody = { key: 404 }
            await request.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(responseBody),
            });
        });
        const loanCalcResponse = page.waitForResponse("**/api/loan-calc*");
        await smallLoanPage.open();
        await loanCalcResponse;
        await smallLoanPage.checkPaymentUndefined();
    });
});