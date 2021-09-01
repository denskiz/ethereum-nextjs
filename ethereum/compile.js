const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

// path to build folder
const buildPath = path.resolve(__dirname, 'build');
// delete build folder
fs.removeSync(buildPath);

// path to campaign.sol file
const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf8');

const input = {
  language: 'Solidity',
  sources: {
    'Campaign.sol': {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*'],
      },
    },
  },
};

// output contains two objects: campaign and campaign factory
const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
  'Campaign.sol'
];

// create build folder
fs.ensureDirSync(buildPath);

// loop over output and create the two contracts
for (let contract in output) {
  fs.outputJSONSync(
    path.resolve(buildPath, contract + '.json'),
    output[contract]
  );
}
