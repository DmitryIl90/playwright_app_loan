import {Locator, Page} from "@playwright/test";
import {Button} from "../atoms/Button";

export class LoanDecisionPage {
    readonly page: Page;
    readonly finalAmount: Locator;
    readonly finalPeriod: Locator;
    readonly finalDecisionContinueButton: Button
    readonly finalSuccessButton: Button
    readonly finalMonthlyPayment: Locator;

    constructor(page: Page) {
        this.page = page;
        this.finalAmount = page.getByTestId("final-page-amount");
        this.finalPeriod = page.getByTestId("final-page-period");
        this.finalDecisionContinueButton = new Button(page, "final-page-continue-button")
        this.finalSuccessButton = new Button(page, "final-page-success-ok-button")
        this.finalMonthlyPayment = page.getByTestId("final-page-monthly-payment");
    }

    async getFinalAmountValue(): Promise<string> {
        const text = await this.finalAmount.innerText();

        return text.split(" ")[0];
    }

    async getFinalPeriodValue(): Promise<string> {
        const text = await this.finalPeriod.innerText();
        return text.split(" ")[0];
    }

    async getFinalMonthlyPaymentValue(): Promise<string> {
        const text = await this.finalMonthlyPayment.innerText();
        return text.split(" ")[0];
    }
}
