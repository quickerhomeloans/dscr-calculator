// Run with: node --test
const test = require('node:test');
const assert = require('node:assert');
const { monthlyPayment, dscr, maxLoan } = require('./dscr.js');

const close = (a, b, tol = 0.01) => assert.ok(Math.abs(a - b) <= tol, `${a} != ${b}`);

test('30-year amortizing payment', () => {
  // $250,000 at 7% over 30 years = $1,663.26/mo
  close(monthlyPayment(250000, 7, 30, false), 1663.26);
});

test('interest-only payment', () => {
  // $250,000 at 7% interest-only = $1,458.33/mo
  close(monthlyPayment(250000, 7, 30, true), 1458.33);
});

test('zero rate amortizes evenly', () => {
  close(monthlyPayment(360000, 0, 30, false), 1000);
});

test('DSCR = rent / PITIA', () => {
  const r = dscr({
    monthlyRent: 2400, loanAmount: 250000, rate: 7, termYears: 30,
    annualTaxes: 3600, annualInsurance: 1200, monthlyHoa: 0,
  });
  close(r.pitia, 2063.26);
  close(r.dscr, 2400 / 2063.26, 0.0001);
});

test('interest-only raises DSCR', () => {
  const base = { monthlyRent: 2400, loanAmount: 250000, rate: 7, termYears: 30, annualTaxes: 3600, annualInsurance: 1200 };
  assert.ok(dscr({ ...base, interestOnly: true }).dscr > dscr(base).dscr);
});

test('maxLoan round-trips to the target DSCR', () => {
  const input = { monthlyRent: 2400, rate: 7, termYears: 30, annualTaxes: 3600, annualInsurance: 1200, targetDscr: 1.0 };
  const loan = maxLoan(input);
  close(dscr({ ...input, loanAmount: loan }).dscr, 1.0, 0.0001);
});

test('maxLoan is 0 when expenses exceed rent', () => {
  assert.strictEqual(maxLoan({ monthlyRent: 200, rate: 7, termYears: 30, annualTaxes: 3600 }), 0);
});
