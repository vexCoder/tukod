import path from "path";
import fs from "fs-extra";
import { PackageJson } from "type-fest";
import meow from "meow";
import semver from "semver";
import pm from "p-map";
import { execa } from "execa";

const main = async () => {
  const cli = meow(``, {
    importMeta: import.meta,
    flags: {
      prod: { type: "boolean", default: false },
      type: { type: "string", default: "patch" },
    },
  });

  const isDev = !cli.flags.prod;
  const root = path.resolve(process.cwd(), "..");
  const buildPath = path.resolve(root, ".build");
  const cliBuildPath = path.resolve(root, "cli", "dist");
  const isExistBuild = await fs.pathExists(buildPath);

  if (isExistBuild) await fs.remove(buildPath);
  await fs.ensureDir(buildPath);
  await fs.copy(cliBuildPath, buildPath);
  const files = ["README.md", "LICENSE"];
  await pm(files, async (file) => {
    await fs.copy(path.resolve(root, file), path.resolve(buildPath, file));
  });

  const pkg = (await fs.readJSON(
    path.resolve(root, "package.json")
  )) as PackageJson;
  const version = pkg.version;
  const newVersion = isDev ? version : semver.inc(version, cli.flags.type);

  await fs.writeJSON(
    path.resolve(buildPath, "package.json"),
    {
      name: "tukod",
      description: "monorepo mini helper tools",
      author: "vexCoder <freelance.starterpack08@gmail.com>",
      version: newVersion,
      bugs: {
        url: "https://github.com/vexCoder/tukod/issues",
      },
      homepage: "https://github.com/vexCoder/tukod#readme",
      repository: {
        type: "git",
        url: "https://github.com/vexCoder/tukod.git",
      },
      exports: "./src/index.ts",
      main: "index.js",
      keywords: ["builder", "cli", "monorepo"],
      license: "MIT",
      engines: {
        node: "^12.20.0 || ^14.13.1 || >=16.0.0",
      },
      bin: {
        tk: "./index.js",
      },
    } as PackageJson,
    { spaces: 2 }
  );

  await execa("yarn", ["publish", "--access", "public"], {
    stdio: "inherit",
    cwd: buildPath,
  });
};

main().catch(console.error);
