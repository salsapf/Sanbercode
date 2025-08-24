describe("Scenario Login OrangeHRM", () => {
  beforeEach(() => {
    // Visit the login page before each test.
    cy.visit(
      "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"
    );
  });
  it("TC-001: Should load login page with all elements displayed correctly ", () => {
    cy.get(".orangehrm-login-branding > img")
      .should("be.visible")
      .and("have.attr", "alt");
    cy.get(".oxd-text--h5").should("be.visible");
    cy.get(".oxd-sheet > :nth-child(1)").should("be.visible");
    cy.get(".oxd-sheet > :nth-child(2)").should("be.visible");
    cy.get(".orangehrm-login-logo > img")
      .should("be.visible")
      .and("have.attr", "alt");
    cy.get(".oxd-icon.bi-person.oxd-input-group__label-icon").should(
      "be.visible"
    );
    cy.get(
      ":nth-child(2) > .oxd-input-group > .oxd-input-group__label-wrapper > .oxd-label"
    ).should("be.visible");
    cy.get('[name="username"]')
      .should("be.visible")
      .and("have.attr", "name", "username")
      .and("have.attr", "placeholder");
    cy.get(".oxd-icon.bi-key.oxd-input-group__label-icon").should("be.visible");
    cy.get(
      ":nth-child(3) > .oxd-input-group > .oxd-input-group__label-wrapper > .oxd-label"
    ).should("be.visible");
    cy.get('[name="password"]')
      .should("be.visible")
      .and("have.attr", "name", "password")
      .and("have.attr", "type", "password");
    cy.get("button[type='submit']")
      .should("be.visible")
      .and("be.enabled")
      .and("contain.text", "Login");
    cy.get(".orangehrm-login-forgot > .oxd-text").should("be.visible");
    cy.get(".orangehrm-copyright-wrapper > :nth-child(1)").should("be.visible");
    cy.get(".orangehrm-copyright-wrapper > :nth-child(2)").should("be.visible");
    cy.get(".orangehrm-login-footer-sm").should("be.visible");
  });
  it("TC-002: Should login succesfully with valid credentials ", () => {
    cy.get('[name="username"]').type("Admin");
    cy.get('[name="password"]').type("admin123");
    cy.get("button[type='submit']").click();
    cy.url().should("include", "dashboard");
  });
  it("TC-003: Should fail login with invalid username and valid password", () => {
    cy.get('[name="username"]').type("User");
    cy.get('[name="password"]').type("admin123");
    cy.get("button[type='submit']").click();
    cy.get(".oxd-alert").should("be.visible").log("Invalid Credentials");
  });
  it("TC-004: Should fail login with valid username and invalid password", () => {
    cy.get('[name="username"]').type("Admin");
    cy.get('[name="password"]').type("admin1234");
    cy.get("button[type='submit']").click();
    cy.get(".oxd-alert").should("be.visible").log("Invalid Credentials");
  });
  it("TC-005: Should fail login with empty username and valid password", () => {
    cy.get('[name="password"]').type("admin123");
    cy.get("button[type='submit']").click();
    cy.get(".oxd-input-group > .oxd-text").should("be.visible");
  });
  it("TC-006: Should fail login with valid username and empty password", () => {
    cy.get('[name="username"]').type("Admin");
    cy.get("button[type='submit']").click();
    cy.get(".oxd-input-group > .oxd-text").should("be.visible");
  });
  it("TC-007: Should fail login with empty username and password", () => {
    cy.get("button[type='submit']").click();
    cy.get(":nth-child(2) > .oxd-input-group > .oxd-text").should("be.visible");
    cy.get(":nth-child(3) > .oxd-input-group > .oxd-text").should("be.visible");
  });
  it("TC-008: Should login successfully with case sensitive username", () => {
    cy.get('[name="username"]').type("ADMIN");
    cy.get('[name="password"]').type("admin123");
    cy.get("button[type='submit']").click();
    cy.url().should("include", "dashboard");
  });
  it("TC-009: Should fail login with case sensitive password", () => {
    cy.get('[name="username"]').type("Admin");
    cy.get('[name="password"]').type("ADMIN123");
    cy.get("button[type='submit']").click();
    cy.get(".oxd-alert").should("be.visible").log("Invalid Credentials");
  });
  it("TC-010: Should fail login with case sensitive username and password", () => {
    cy.get('[name="username"]').type("ADMIN");
    cy.get('[name="password"]').type("ADMIN123");
    cy.get("button[type='submit']").click();
    cy.get(".oxd-alert").should("be.visible").log("Invalid Credentials");
  });
  it("TC-011: Should fail login with spaces around username", () => {
    cy.get('[name="username"]').type(" Admin");
    cy.get('[name="password"]').type("admin123");
    cy.get("button[type='submit']").click();
    cy.get(".oxd-alert").should("be.visible").log("Invalid Credentials");
  });
  it("TC-012: Should fail login with spaces around password", () => {
    cy.get('[name="username"]').type("Admin");
    cy.get('[name="password"]').type(" admin123");
    cy.get("button[type='submit']").click();
    cy.get(".oxd-alert").should("be.visible").log("Invalid Credentials");
  });
  it("TC-013: Should fail login with spaces around username and password", () => {
    cy.get('[name="username"]').type("Admin ");
    cy.get('[name="password"]').type(" admin123");
    cy.get("button[type='submit']").click();
    cy.get(".oxd-alert").should("be.visible").log("Invalid Credentials");
  });
  it("TC-014: Should login successfully using keyboard Enter", () => {
    cy.get('[name="username"]').type("Admin");
    cy.get('[name="password"]').type("admin123");
    cy.get('[name="password"]').type("{enter}");
    cy.url().should("include", "dashboard");
  });
  it("TC-015: Should navigate through form fields using Tab Keyboard", () => {
    //Focus on the first field (username)
    cy.get('[name="username"]').focus();
    cy.get('[name="username"]').should("have.focus");
    // Press Tab to move to the password field
    cy.get('[name="username"]').tab();
    cy.get('[name="password"]').should("have.focus");
    // Press Tab again to move to the Login button
    cy.get('[name="password"]').tab();
    cy.get("button[type='submit']").should("have.focus");
  });
  afterEach(() => {
    // Clear session data
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
  });

  // Final cleanup after all tests
  after(() => {
    cy.log("All OrangeHRM Login Tests Completed Successfully!");
  });
});
