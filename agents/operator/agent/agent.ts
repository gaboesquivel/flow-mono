import { defineAgent } from "eve";

import { eveModelId } from "../../../apps/web/lib/ai/models";

export default defineAgent({
  model: eveModelId({ operator: true }),
  modelContextWindowTokens: 200_000,
});
