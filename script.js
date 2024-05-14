const readInstalled = require('read-installed');
const json2csv = require('json2csv').parse;
const fs = require('fs');

const dependencies = new Set();
const processed = new Set();

function extractDependencies(data, parent = null, depth = 0, types = ['dependencies']) {
  types.forEach(type => {
    if (data[type]) {
      for (let key in data[type]) {
        const dep = data[type][key];
        const uniqueId = `${dep.name}@${dep.version}`;
        if (processed.has(uniqueId)) {
          continue;
        }
        processed.add(uniqueId);
        dependencies.add({
          name: dep.name,
          version: dep.version,
          license: dep.license || 'Unknown',
          path: dep.path,
          depth: depth,
          link: `https://www.npmjs.com/package/${dep.name}`,
          parent: parent ? parent.name : null,
        });
        extractDependencies(dep, dep, depth + 1, types);
      }
    }
  });
}

function analyzeProjects(projectPaths, options, callback) {
  const types = [];
  if (options.S) types.push('dependencies');
  if (options.D) types.push('devDependencies');
  if (options.O) types.push('optionalDependencies');
  if (options.P) types.push('peerDependencies');
  if (!options.S && !options.D && !options.O && !options.P) {
    types.push('dependencies');
    types.push('devDependencies');
  }

  Promise.all(projectPaths.map(path => {
    return new Promise((resolve, reject) => {
      readInstalled(path, {dev: options.D}, function (err, data) {
        if (err) {
          reject(err);
        } else {
          extractDependencies(data, null, 0, types);
          resolve();
        }
      });
    });
  })).then(() => {
    if (dependencies.size > 0) { // 检查是否有依赖项
      const csv = json2csv(Array.from(dependencies));
      fs.writeFile('dependencies.csv', csv, function(err) {
        if (err) {
          callback(err);
        } else {
          callback(null, 'CSV file saved.');
        }
      });
    } else {
      callback(null, 'No dependencies found.'); // 如果没有找到依赖项，返回一个友好的消息
    }
  }).catch(err => {
    callback(err);
  });
}

module.exports = analyzeProjects;