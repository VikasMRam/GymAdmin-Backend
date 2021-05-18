// As per https://github.com/michaelleeallen/mocha-junit-reporter/issues/132
const fs = require('fs');

const { parseString } = require('xml2js');
const xml2js = require('xml2js');

fs.readdir('./cypress/results', (err, files) => {
  if (err) {
    return console.log(err);
  }
  files.forEach((file) => {
    const filePath = `./cypress/results/${file}`;
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return console.log(err);
      }

      parseString(data, (err, xml) => {
        if (err) {
          return console.log(err);
        }

        const { file } = xml.testsuites.testsuite[0].$;
        xml.testsuites.testsuite.forEach((testsuite, index) => {
          if (index > 0) {
            testsuite.$.file = file;
          }
        });

        const builder = new xml2js.Builder();
        const xmlOut = builder.buildObject(xml);
        fs.writeFile(filePath, xmlOut, (err) => {
          if (err) throw err;
        });
      });
    });
  });
});
