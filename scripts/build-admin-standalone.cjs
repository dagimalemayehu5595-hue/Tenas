const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const publicDir = path.join(root, "public");
const deployDir = path.join(root, "deploy");

const html = fs.readFileSync(path.join(publicDir, "admin.html"), "utf8");
const css = fs.readFileSync(path.join(publicDir, "styles.css"), "utf8");
const react = fs.readFileSync(path.join(publicDir, "vendor", "react.production.min.js"), "utf8");
const reactDom = fs.readFileSync(path.join(publicDir, "vendor", "react-dom.production.min.js"), "utf8");
const babelSource = fs.readFileSync(path.join(publicDir, "vendor", "babel.min.js"), "utf8");
const footerSource = fs.readFileSync(path.join(publicDir, "footer.js"), "utf8");
const adminSource = fs.readFileSync(path.join(publicDir, "admin.js"), "utf8");

const context = {};
vm.createContext(context);
vm.runInContext(babelSource, context);

const compile = (source) => context.Babel.transform(source, {
  presets: ["env", "react"]
}).code;

const scriptPattern = /\s*<script src="\.\/vendor\/react\.production\.min\.js"><\/script>\s*<script src="\.\/vendor\/react-dom\.production\.min\.js"><\/script>\s*<script src="\.\/vendor\/babel\.min\.js"><\/script>\s*<script type="text\/babel" data-presets="env,react" src="\.\/footer\.js\?v=[^"]+"><\/script>\s*<script type="text\/babel" data-presets="env,react" src="\.\/admin\.js\?v=[^"]+"><\/script>/;

let output = html
  .replace(/<link rel="stylesheet" href="\.\/styles\.css\?v=[^"]+" \/>/, `<style>${css}</style>`)
  .replace(scriptPattern, () => [
    `<script>${react}</script>`,
    `<script>${reactDom}</script>`,
    `<script>${compile(footerSource)}</script>`,
    `<script>${compile(adminSource)}</script>`
  ].join("\n"));

fs.mkdirSync(deployDir, { recursive: true });
const outputPath = path.join(deployDir, "admin.html");
fs.writeFileSync(outputPath, output, "utf8");
console.log(`${outputPath} (${output.length} characters)`);
