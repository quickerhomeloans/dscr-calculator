# Simple DSCR Calculator

A small, dependency-free JavaScript calculator for **DSCR (debt service coverage ratio)** on rental property loans. Use it in the browser or in Node.

**Live demo:** https://quickerhomeloans.github.io/dscr-calculator/

Built and maintained by [Quicker Home Loans](https://quickerhomeloans.com), a business-purpose lender for real estate investors.

## What is DSCR?

DSCR compares a rental property's income to its monthly loan payment:

```
DSCR = gross monthly rent / monthly PITIA
PITIA = principal & interest + property taxes + insurance + HOA (monthly)
```

- **DSCR above 1.0**: the rent covers the payment.
- **DSCR of exactly 1.0**: the rent covers the payment with nothing left over.
- **DSCR below 1.0**: the payment is more than the rent.

DSCR loans qualify a borrower on the property's rental income instead of personal income, so no tax returns or W-2s are needed. Many lenders look for 1.0 or higher, and some programs accept lower ratios. Learn more in this [guide to DSCR loans](https://quickerhomeloans.com/loans/dscr).

An interest-only payment is lower than an amortizing payment, so the same property shows a higher DSCR on interest-only.

## Usage

### Browser

```html
<script src="dscr.js"></script>
<script>
  const result = DSCR.dscr({
    monthlyRent: 2400,
    loanAmount: 250000,
    rate: 7,              // percent
    termYears: 30,
    annualTaxes: 3600,
    annualInsurance: 1200,
    monthlyHoa: 0,
    interestOnly: false,
  });
  // { pi: 1663.26, pitia: 2063.26, dscr: 1.163... }
</script>
```

### Node

```js
const { dscr, maxLoan, monthlyPayment } = require('./dscr.js');

maxLoan({
  monthlyRent: 2400,
  rate: 7,
  termYears: 30,
  annualTaxes: 3600,
  annualInsurance: 1200,
  targetDscr: 1.0,
}); // largest loan that still hits DSCR 1.0
```

## API

| Function | Returns |
|---|---|
| `monthlyPayment(loanAmount, ratePct, termYears, interestOnly)` | Monthly principal & interest (or interest-only payment) |
| `pitia(input)` | Monthly PITIA |
| `dscr(input)` | `{ pi, pitia, dscr }` |
| `maxLoan(input)` | Largest loan amount that meets `input.targetDscr` (default 1.0) |

Taxes and insurance are **annual** amounts. HOA is **monthly**. Rates are in percent (`7` = 7%).

## Tests

```
node --test
```

## Need more than this?

This is intentionally minimal. The full [DSCR Rental Calculator](https://quickerhomeloans.com/calculators/dscr) adds vacancy, operating expenses, cash flow, cap rate, purchase/refinance modes and a PDF export. To estimate a property's value and rent from its address, try the [Property Value Estimator](https://quickerhomeloans.com/property-value-estimator).

## Disclaimer

Results are estimates for educational use only. They are not a loan offer, approval, or commitment to lend. Actual qualification, rates and terms depend on full underwriting.

## License

MIT (c) Quicker Home Loans LLC
