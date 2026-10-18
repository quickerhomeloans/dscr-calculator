/*!
 * dscr-calculator - simple DSCR calculator for rental property loans
 * https://github.com/quickerhomeloans/dscr-calculator
 * MIT License (c) Quicker Home Loans LLC - https://quickerhomeloans.com
 *
 * Works in the browser (window.DSCR) and in Node (require('./dscr.js')).
 * No dependencies.
 */
(function (root) {
  'use strict';

  function toNum(v) {
    var n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }

  /**
   * Monthly principal & interest payment.
   * @param {number} loanAmount       loan principal in dollars
   * @param {number} annualRatePct    note rate in percent, e.g. 7.25
   * @param {number} termYears        amortization term in years, e.g. 30
   * @param {boolean} interestOnly    true = interest-only payment
   */
  function monthlyPayment(loanAmount, annualRatePct, termYears, interestOnly) {
    var p = toNum(loanAmount);
    var r = toNum(annualRatePct) / 100 / 12;
    var n = toNum(termYears) * 12;
    if (p <= 0) return 0;
    if (interestOnly) return p * r;
    if (n <= 0) return 0;
    if (r === 0) return p / n;
    var f = Math.pow(1 + r, n);
    return (p * r * f) / (f - 1);
  }

  /**
   * Full monthly payment: principal & interest + taxes + insurance + HOA (PITIA).
   * Taxes and insurance are ANNUAL amounts; HOA is MONTHLY.
   */
  function pitia(input) {
    var pi = monthlyPayment(input.loanAmount, input.rate, input.termYears, input.interestOnly);
    return pi + toNum(input.annualTaxes) / 12 + toNum(input.annualInsurance) / 12 + toNum(input.monthlyHoa);
  }

  /**
   * DSCR = gross monthly rent / monthly PITIA.
   * Returns { pi, pitia, dscr }.
   */
  function dscr(input) {
    var pi = monthlyPayment(input.loanAmount, input.rate, input.termYears, input.interestOnly);
    var total = pitia(input);
    var rent = toNum(input.monthlyRent);
    return { pi: pi, pitia: total, dscr: total > 0 ? rent / total : 0 };
  }

  /**
   * Largest loan amount that still hits a target DSCR (default 1.0),
   * given the rent, taxes, insurance, HOA, rate and term.
   */
  function maxLoan(input) {
    var target = toNum(input.targetDscr) || 1;
    var maxPitia = toNum(input.monthlyRent) / target;
    var tia = toNum(input.annualTaxes) / 12 + toNum(input.annualInsurance) / 12 + toNum(input.monthlyHoa);
    var maxPi = maxPitia - tia;
    if (maxPi <= 0) return 0;
    var r = toNum(input.rate) / 100 / 12;
    var n = toNum(input.termYears) * 12;
    if (input.interestOnly) return r > 0 ? maxPi / r : 0;
    if (n <= 0) return 0;
    if (r === 0) return maxPi * n;
    var f = Math.pow(1 + r, n);
    return (maxPi * (f - 1)) / (r * f);
  }

  var api = { monthlyPayment: monthlyPayment, pitia: pitia, dscr: dscr, maxLoan: maxLoan };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.DSCR = api;
  }
})(typeof self !== 'undefined' ? self : this);
