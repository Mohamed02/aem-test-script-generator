#!/usr/bin/env node

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function createDirectoryStructure(componentName, variationList) {
  const projectRoot = process.cwd();
  const testFolderPath = path.join(projectRoot, 'test');
  const resourcesFolderPath = path.join(testFolderPath, 'resources');
  const mockDataFolderPath = path.join(resourcesFolderPath, 'mock-data');
  const modelDataFolderPath = path.join(resourcesFolderPath, 'model-data');

  fs.mkdirSync(mockDataFolderPath, { recursive: true });
  fs.mkdirSync(modelDataFolderPath, { recursive: true });

  variationList.forEach((variation) => {
    const mockJsonFileName = `${componentName}-${variation}.mock.json`;
    const modelJsonFileName = `${componentName}-${variation}.model.json`;

    fs.writeFileSync(path.join(mockDataFolderPath, mockJsonFileName), '{}');
    fs.writeFileSync(path.join(modelDataFolderPath, modelJsonFileName), '{}');
  });

  const testFileContent = `// Test file for ${componentName}\nconsole.log('Testing ${componentName}');`;
  fs.writeFileSync(path.join(testFolderPath, `${componentName}.test.js`), testFileContent);

  console.log('Folder hierarchy created successfully!');
}

rl.question('Enter the component name: ', (componentName) => {
  rl.question('Enter variation list (comma-separated): ', (variations) => {
    const variationList = variations.split(',').map(variation => variation.trim());
    createDirectoryStructure(componentName, variationList);
    rl.close();
  });
});

rl.on('close', () => {
  process.exit(0);
});