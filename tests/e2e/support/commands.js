// ***********************************************
// See documentation for more info:
// https://docs.cypress.io/api/cypress-api/custom-commands
// ***********************************************

import { apiMocks, fileMocks } from "./mocks";

Cypress.Commands.add("getHook", names => {
  const selector = names.split(".").map(name => `[data-test~=${name}]`).join(" ");
  // eslint-disable-next-line cypress/require-data-selectors
  return cy.get(selector);
});

Cypress.Commands.add("login", () => {
  const key = `oidc.user:${Cypress.env("IAM_BASE_URL")}/auth/realms/bimdata:${Cypress.env("OIDC_CLIENT_ID")}`;
  const user = {};
  localStorage.setItem(key, JSON.stringify(user));
});

Cypress.Commands.add("logout", () => {
  const key = `oidc.user:${Cypress.env("IAM_BASE_URL")}/auth/realms/bimdata:${Cypress.env("OIDC_CLIENT_ID")}`;
  localStorage.removeItem(key);
});

Cypress.Commands.add("apiMock", ({ name, method = "GET", path, data }) => {
  cy.intercept(method, `${Cypress.env("API_BASE_URL")}${path}`, { fixture: data }).as(name);
});

Cypress.Commands.add("fileMock", ({ path, data }) => {
  cy.intercept("GET", `https://file-storage${path}`, { fixture: data });
});

Cypress.Commands.add("setupMocks", () => {
  cy.intercept(`${Cypress.env("BACKEND_BASE_URL")}/*`, req => req.reply({ statusCode: 200 }));
  apiMocks.forEach(cy.apiMock);
  fileMocks.forEach(cy.fileMock);
});
