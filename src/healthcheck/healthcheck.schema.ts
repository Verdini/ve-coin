export const HealthcheckSchema = {
  description: "Check if API is running",
  tags: ["Healthcheck"],
  summary: "Healthcheck",
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "string" },
      },
    },
  },
};
