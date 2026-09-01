import { defineRailway, project, service, github } from "railway/iac";

export default defineRailway(() => {
  const congreso_csa = service("congreso-csa", {
    source: github("darioblad/congreso-csa"),
    start: "npm start",
  });
  return project("congreso csa", {
    resources: [congreso_csa],
  });
});
