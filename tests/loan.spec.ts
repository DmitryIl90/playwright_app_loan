import { test, expect } from '@playwright/test';
import {SmallLoanPage} from "../page-objects/pages/SmallLoanPage";
import {LoanDecisionPage} from "../page-objects/pages/LoanDecisionPage";

test.describe('Loan app tests', async () => {
  test('TL-20-1 base test', async ({ page }) => {
    const smallLoanPage = new SmallLoanPage(page);
    const loanDecisionPage = new LoanDecisionPage(page);
    await smallLoanPage.open();
    const prefilledAmount = await smallLoanPage.amountInput.getCurrentValue();
    const prefilledPeriod = await smallLoanPage.getFirstPeriodOption();
    await smallLoanPage.applyButton.click();
    await smallLoanPage.usernameInput.fill("test");
    await smallLoanPage.passwordInput.fill("test");
    await smallLoanPage.continueButton.click();
    const finalAmount = await loanDecisionPage.getFinalAmountValue();
    const finalPeriod = await loanDecisionPage.getFinalPeriodValue();
    expect(finalAmount).toEqual(prefilledAmount);
    expect(finalPeriod).toEqual(prefilledPeriod);
    await loanDecisionPage.finalDecisionContinueButton.click();
    await loanDecisionPage.finalSuccessButton.click();
    await smallLoanPage.applyImage1.click();
    await smallLoanPage.amountInput.checkInViewInput();
    await smallLoanPage.applyImage2.click();
    await smallLoanPage.amountInput.checkInViewInput();
    const amountSlider = smallLoanPage.amountSlider;
    const periodSlider = smallLoanPage.periodSlider;

    const amountSliderOffsetWidth = await amountSlider.evaluate((el) => {
      return el.getBoundingClientRect().width;
    });
    await amountSlider.hover({ force: true, position: { x: 0, y: 0 } });
    await page.mouse.down();
    await amountSlider.hover({
      force: true,
      position: { x: amountSliderOffsetWidth / 2, y: 0 },
    });
    await page.mouse.up();

    const periodSliderOffsetWidth = await periodSlider.evaluate((el) => {
      return el.getBoundingClientRect().width;
    });
    await periodSlider.hover({ force: true, position: { x: 0, y: 0 } });
    await page.mouse.down();
    await periodSlider.hover({
      force: true,
      position: { x: periodSliderOffsetWidth / 2, y: 0 },
    });
    await page.mouse.up();

    const newAmount = await smallLoanPage.amountInput.getCurrentValue();
    const newPeriodValue = await smallLoanPage.getPeriodCurrentValue();
    const monthlyPayment = await smallLoanPage.getMonthlyPayment();

    await smallLoanPage.applyButton.click();
    await smallLoanPage.login();

    const finalNewAmount = await loanDecisionPage.getFinalAmountValue();
    const finalPayment = await loanDecisionPage.getFinalMonthlyPaymentValue();
    const newFinalPeriod = await loanDecisionPage.getFinalPeriodValue();

    expect(finalNewAmount).toEqual(newAmount);
    expect(monthlyPayment).toEqual(finalPayment);
    expect(newPeriodValue).toEqual(newFinalPeriod);
  });
});
