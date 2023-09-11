// ***********************************************
// See documentation for more info:
// https://docs.cypress.io/api/cypress-api/custom-commands
// ***********************************************

Cypress.Commands.add("createUser", ({ key, firstname, lastname }) => {
  cy.task("create-user", { key, firstname, lastname }).then((user) => {
    cy.visit("/");

    cy.get('a[href^="/signup"]').click();
    cy.get("input[name=email]").type(user.email);
    cy.get("input[name=first_name]").type(user.firstname);
    cy.get("input[name=last_name]").type(user.lastname);
    cy.get("input[name=password1]").type(user.password);
    cy.get("input[name=password2]").type(user.password);
    cy.get("input[type=submit]").click();

    // TODO: add BIMData CGU into bimdata-test on-premise to avoid this "tricks".
    // Make sure this line is commented before committing, otherwise the tests will fail in the CI.
    // Uncomment this line when you want to launch tests locally.
    // cy.get("input[type=submit][value=Accept]").click(); // <!> Keep this line <!>

    return cy
      .url()
      .should("contain", Cypress.env("APP_BASE_URL"))
      .then(() => user);
  });
});

Cypress.Commands.add("deleteUser", ({ key }) => {
  cy.task("get-user", key).then((user) => {
    cy.login(user);
    cy.visit(`${Cypress.env("AUTH_BASE_URL")}/profile/delete/`);
    cy.get("input#id_password").type(user.password);
    cy.get("button[type=submit]").click();
  });
});

Cypress.Commands.add("login", ({ email, password }) => {
  cy.session([email, password], () => {
    cy.visit("/");

    cy.get("input[name=email]").type(email);
    cy.get("input[name=password]").type(password);
    cy.get("input[type=submit]").click();

    cy.url().should("contain", Cypress.env("APP_BASE_URL"));
  });
});

Cypress.Commands.add("logout", () => {
  cy.hook("btn-toggle-app-menu").click();
  cy.hook("btn-logout").click();

  cy.url().should("contain", `${Cypress.env("AUTH_BASE_URL")}/accounts/login`);
});

Cypress.Commands.add("hook", (path, options) =>
  cy.get(
    path
      .split(".")
      .map((name) => `[data-test-id=${name}]`)
      .join(" "),
    options
  )
);
Cypress.Commands.add("findHook", { prevSubject: true }, (subject, id) =>
  subject.find(`[data-test-id=${id}]`)
);
Cypress.Commands.add("withParam", { prevSubject: true }, (subject, param) =>
  subject.filter(`[data-test-param=${param}]`)
);
Cypress.Commands.add("param", { prevSubject: true }, (subject) =>
  subject.data("testParam")
);

Cypress.Commands.add("getSpaceCard", (name, options) =>
  cy.contains("[data-test-id=space-card]", name, options)
);
Cypress.Commands.add("getProjectCard", (name, options) =>
  cy.contains("[data-test-id=project-card]", name, options)
);
Cypress.Commands.add("getGroupCard", (name, options) =>
  cy.contains("[data-test-id=group-card]", name, options)
);

Cypress.Commands.add("deleteGedDoc", (name) => {
  cy.hook("files-table")
    .contains("tr", name)
    .within(() => {
      cy.hook("btn-actions-cell").click();
    });
  cy.hook("btn-delete-doc").filter(":visible").click();
  cy.hook("btn-confirm-delete").click();
});

Cypress.Commands.add("createTag", (name) => {
  cy.hook("btn-create-tag").click();
  cy.get("input[name=add-tag]").type(name);
  cy.hook("btn-validate-tag").click();

  cy.hook("tag-list").contains("div", name).should("have.length", 1);
});

Cypress.Commands.add("deleteTag", (name) => {
  cy.hook("tag-list")
    .contains("div[data-test-id=tags-item]", name)
    .within(() => {
      cy.hook("btn-delete-tag").click();
      cy.hook("btn-confirm-delete").click();
    });
  cy.hook("tag-list").contains(name).should("not.exist");
});

Cypress.Commands.add("fillInvitForm", (user) => {
  cy.hook("btn-invit").click();

  cy.task("get-user", user).then(({ email }) => {
    cy.get("input[class=invitation-form__input__email]").type(email);
    cy.hook("btn-submit-invit").click();

    cy.contains(".invitation-card", email).should("have.length", 1);
  });
});

Cypress.Commands.add("invitInProject", (requester, requested) => {
  cy.task("get-user", requester).then((user) => cy.login(user));
  cy.visit("/projects");
  cy.hook("project-card").first().click();

  cy.fillInvitForm(requested);
});

Cypress.Commands.add("acceptInvit", (requester, requested) => {
  cy.task("get-user", requested).then((user) => cy.login(user));
  cy.visit("/invitations");

  cy.task("get-user", requester).then(({ firstname, lastname }) => {
    cy.hook("card-invitation", { timeout: 60000 })
      .first()
      .within(() => {
        cy.contains(firstname).should("have.length", 1);
        cy.contains(lastname).should("have.length", 1);

        cy.hook("btn-accept-invit").click();
        cy.hook("btn-go-to-project").click();
      });
  });

  cy.task("get-user", requested).then(({ email }) => {
    cy.contains(".invitation-card", email).should("not.exist");
    cy.contains(".user-card", email).should("have.length", 1);
  });
});
