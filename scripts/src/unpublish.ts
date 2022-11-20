import { execa } from "execa";
import path from "path";

interface UnPublishOptions {
  version?: string;
}

const unpublish = async (cli: Utils.CLI<UnPublishOptions>) => {
  const root = path.resolve(process.cwd(), "..");
  const buildPath = path.resolve(root, ".build");

  if (!!cli.flags.version) {
    await execa("npm", ["unpublish", `tukod@${cli.flags.version}`], {
      stdio: "inherit",
      cwd: buildPath,
    });
  }
};

export default unpublish;
