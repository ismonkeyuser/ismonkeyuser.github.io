const fs = require('fs');
const { exec } = require('child_process');

fs.watch('./_sass', { encoding: 'buffer' }, (eventType, filename) => {
  if (filename) {
    exec('jekyll b', (err, stdout, stderr) => {
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
    })
    // Prints: <Buffer ...>
  }
});
