import { componentNames, compositionGuidance } from "../../apps/web/lib/genui/index";
import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description: "List registered GenUI root components and composition guidance.",
  execute() {
    return { components: componentNames, guidance: compositionGuidance };
  },
  inputSchema: z.object({}),
});
