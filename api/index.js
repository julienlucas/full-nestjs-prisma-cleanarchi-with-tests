// Fonction Vercel : délègue à la sortie de `nest build`, où les alias
// TypeScript (@infrastructure/…) sont déjà résolus en chemins relatifs.
// `nest build` émet dans dist/src/ (et non dist/) car tsconfig couvre aussi tests/.
module.exports = require('../dist/src/serverless').default;
