/* eslint-disable */

const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

async function main() {
  await runCommand("npm init -y");
  await runCommand("npm i -D typescript tsc @types/node ts-node");
  await runCommand(
    "npm i -D eslint eslint-cli @typescript-eslint/eslint-plugin @typescript-eslint/parser prettier eslint-config-prettier eslint-plugin-prettier"
  );
  await runCommand("mkdir -p src");
  await runCommand("echo '' >>  src/index.ts");
  writeJsonFile(".eslintrc.json", eslintConfig());
  writeJsonFile("tsconfig.json", tsConfig());

  addJsonConfig("package.json", "scripts['lint']", '"eslint --fix src/**"');
}

async function runCommand(command) {
  return new Promise((resolve) => {
    console.log(command);
    const args = command.split(" ");
    const proc = spawn(args[0], [...args.slice(1)], {
      stdio: [process.stdin, process.stdout, process.stderr],
    });

    proc.on("exit", () => {
      resolve();
    });
  });
}

function addJsonConfig(filename, path, additionalParam) {
  if (!filename.startsWith(".")) {
    filename = "./" + filename;
  }
  const beforeConfig = require(filename);
  eval(`beforeConfig.${path}=${additionalParam}`);
  fs.writeFileSync(filename, JSON.stringify(beforeConfig, null, 2), "utf8");
  console.log(`add ${filename}, ${path} = ${additionalParam}`);
}

function writeJsonFile(filename, json) {
  console.log(`write to ${filename}`);
  fs.writeFileSync(filename, JSON.stringify(json, null, 2), "utf8");
}

function eslintConfig() {
  return {
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/eslint-recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:prettier/recommended",
      "prettier/@typescript-eslint",
    ],
    plugins: ["@typescript-eslint"],
    env: { node: true, es6: true },
    parser: "@typescript-eslint/parser",
    parserOptions: {
      sourceType: "module",
      project: "./tsconfig.json",
    },
    rules: {},
  };
}

function tsConfig() {
  return {
    compilerOptions: {
      sourceMap: true,
      lib: ["ES2015"],
      target: "es5",
      module: "CommonJS",
    },
  };
}

main();
