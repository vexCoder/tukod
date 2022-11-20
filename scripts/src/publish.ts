import path from "path";
import fs from "fs-extra";
import { PackageJson } from "type-fest";
import meow, { Result, FlagType } from "meow";
import semver from "semver";
import pm from "p-map";
import { execa } from "execa";

export const getAllPkg = async (root?: string) => {
  const pkg = (await fs.readJSON(
    path.resolve(root, "package.json")
  )) as PackageJson;

  const w = pkg.workspaces;
  const workspaces: string[] = Array.isArray(w) ? w : w.packages;
  const apps = workspaces.map((w) => path.resolve(root, w, "package.json"));
  return apps.concat([path.resolve(root, "package.json")]);
};

interface PublishOptions {
  prod?: boolean;
  type?: semver.ReleaseType;
  test?: boolean;
  nopublish?: boolean;
}

const publish = async (cli: Utils.CLI<PublishOptions>) => {
  const isDev = !cli.flags.prod;
  const isTest = cli.flags.test;
  const isPublish = !cli.flags.nopublish;
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
  const newVersion =
    isDev || isTest
      ? semver.inc(version, "prerelease", isTest ? "alpha" : "beta")
      : semver.inc(version, cli.flags.type as semver.ReleaseType);

  await fs.writeJSON(
    path.resolve(buildPath, "package.json"),
    {
      name: "tukod",
      description: "monorepo mini helper tools",
      author: "vexCoder <freelance.starterpack08@gmail.com>",
      type: "module",
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

  let args = ["publish", "--access", isTest ? "public" : "restricted"];

  if (isTest) args = args.concat(["--tag", "beta"]);

  console.log(newVersion);

  if (isPublish) {
    await execa("yarn", args, {
      stdio: "inherit",
      cwd: buildPath,
    });

    const pkgs = await getAllPkg(root);
    await pm(pkgs, async (p) => {
      const pkg = (await fs.readJSON(p)) as PackageJson;
      if (!pkg.version || !pkg.name) return;

      await fs.writeJSON(
        p,
        {
          ...pkg,
          version: newVersion,
        },
        { flag: "", spaces: 2 }
      );
    });
  }
};

export default publish;
