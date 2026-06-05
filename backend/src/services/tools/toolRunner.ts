export const toolRunner = async <T>(
  agentSteps: any[],
  toolName: string,
  toolFunction: () => Promise<T>,
): Promise<T> => {
  try {
    const data = await toolFunction();
    agentSteps.push({
      type: "tool_call",
      name: toolName,
      status: "success",
    });
    return data;
  } catch (err) {
    agentSteps.push({
      type: "tool_call",
      name: toolName,
      status: "failed",
      error: err instanceof Error ? err.message : "Unknown error",
    });
    throw new Error(err instanceof Error ? err.message : "Unknown error");
  }
};
