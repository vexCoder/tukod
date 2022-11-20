import meow from "meow";
import publish from "./publish.js";
import unpublish from "./unpublish.js";

const main = async () => {
    const cli = meow(``, {
      importMeta: import.meta,
      flags: {

        // publish
        prod: { type: "boolean", default: false },
        type: { type: "string", default: "patch" },
        nopublish: { type: "boolean", default: false },

        // unpublish
        version: { type: "string" },
      },
    });

    const command = cli.input[0];

    if (command === "publish") {
        await publish(cli);
        return;
    }

    if (command === "unpublish") {
        await unpublish(cli as any);
        return;
    }

    throw new Error(`Unknown command: ${command}`);
}

main().catch(console.error)