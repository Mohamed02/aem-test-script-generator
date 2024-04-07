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
  const componentTestFolderPath = path.join(testFolderPath, componentName);
  const resourcesFolderPath = path.join(componentTestFolderPath, 'resources');
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

  const testFileTemplatePath = path.join(__dirname, 'test-template.txt');
  const testFileContentTemplate = fs.readFileSync(testFileTemplatePath, 'utf8');

  const variationsArray = JSON.stringify(variationList.map(variation=>`${componentName}-${variation}`));

  // Replace placeholders in the test file template with dynamic values
    const testFileContent = testFileContentTemplate
    .replace(/\${componentName}/g, componentName)
    .replace(/\${variationsArray}/g, variationsArray);

  fs.writeFileSync(path.join(componentTestFolderPath, `${componentName}.test.js`), testFileContent);


  const mockServerContentPath = path.join(__dirname, 'server.txt');
  const mockServerContent = fs.readFileSync(mockServerContentPath, 'utf8');
  fs.writeFileSync(path.join(testFolderPath, `server.js`), mockServerContent);

  const handlerContentPath = path.join(__dirname, 'handler.txt');
  const handlerContent = fs.readFileSync(handlerContentPath, 'utf8');
  fs.writeFileSync(path.join(testFolderPath, `handler.js`), handlerContent);
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