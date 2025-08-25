describe("Scenario Login OrangeHRM", () => {
  beforeEach(() => {
    // Visit the login page before each test.
    cy.visit(
      "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"
    );
  });
  it("TC-001: Should load login page with all elements displayed correctly ", () => {
    //Intercept
    cy.intercept("GET", "**/web/index.php/auth/login").as("loginPageLoad");

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
    //Intercept
    cy.intercept("POST", "**/auth/validate").as("successfulLogin");

    cy.get('[name="username"]').type("Admin");
    cy.get('[name="password"]').type("admin123");
    cy.get("button[type='submit']").click();

    //Wait for and verify the intercept
    cy.wait("@successfulLogin").then((interception) => {
      const requestBody = interception.request.body;
      expect(requestBody).to.include("username=Admin");
      expect(requestBody).to.include("password=admin123");
      expect(requestBody).to.include("_token=");

      // Verify successful response from original server
      expect(interception.response.statusCode).to.be.oneOf([200, 302]);
    });

    //Verify redirect to dashboard
    cy.url().should("include", "dashboard");
  });
  it("TC-003: Should fail login with invalid username and valid password", () => {
    //Intercept
    cy.intercept("POST", "**/auth/validate").as("failedLogin");

    cy.get('[name="username"]').type("User");
    cy.get('[name="password"]').type("admin123");
    cy.get("button[type='submit']").click();
    //Wait for and verify the intercept
    cy.wait("@failedLogin").then((interception) => {
      const requestBody = interception.request.body;
      expect(requestBody).to.include("username=User");
      expect(requestBody).to.include("password=admin123");
      expect(requestBody).to.include("_token=");

      // Verify successful response from original server
      expect(interception.response.statusCode).to.be.oneOf([200, 302]);
    });

    //Verification displays an invalid credential alert
    cy.get(".oxd-alert").should("be.visible").log("Invalid Credentials");
  });
  it("TC-004: Should fail login with valid username and invalid password", () => {
    //Intercept
    cy.intercept("POST", "**/auth/validate").as("invalidPassword");

    cy.get('[name="username"]').type("Admin");
    cy.get('[name="password"]').type("admin1234");
    cy.get("button[type='submit']").click();
    //Wait for and verify the intercept
    cy.wait("@invalidPassword").then((interception) => {
      const requestBody = interception.request.body;
      expect(requestBody).to.include("username=Admin");
      expect(requestBody).to.include("password=admin1234");
      expect(requestBody).to.include("_token=");

      // Verify successful response from original server
      expect(interception.response.statusCode).to.be.oneOf([200, 302]);
    });

    //Verification displays an invalid credential alert
    cy.get(".oxd-alert").should("be.visible").log("Invalid Credentials");
  });
  it("TC-005: Should fail login with empty username and valid password", () => {
    //Intercept
    cy.intercept("POST", "**/auth/validate").as("formValidation");

    cy.get('[name="password"]').type("admin123");
    cy.get("button[type='submit']").click();
    cy.get(".oxd-input-group > .oxd-text").should("be.visible");

    //Verify intercept is not called due to client-side validation
    cy.get("@formValidation.all").should("have.length", 0);
  });
  it("TC-006: Should fail login with valid username and empty password", () => {
    //Intercept
    cy.intercept("POST", "**/auth/validate").as("passwordValidation");

    cy.get('[name="username"]').type("Admin");
    cy.get("button[type='submit']").click();
    cy.get(".oxd-input-group > .oxd-text").should("be.visible");

    //Verify intercept is not called due to client-side validation
    cy.get("@passwordValidation.all").should("have.length", 0);
  });
  it("TC-007: Should fail login with empty username and password", () => {
    //Intercept
    cy.intercept("POST", "**/auth/validate").as("emptyFieldsValidation");

    cy.get("button[type='submit']").click();
    cy.get(":nth-child(2) > .oxd-input-group > .oxd-text").should("be.visible");
    cy.get(":nth-child(3) > .oxd-input-group > .oxd-text").should("be.visible");

    //Verify intercept is not called due to client-side validation
    cy.get("@emptyFieldsValidation.all").should("have.length", 0);
  });
  it("TC-008: Should login successfully with case sensitive username", () => {
    //Intercept
    cy.intercept("POST", "**/auth/validate").as("caseSensitiveUsername");

    cy.get('[name="username"]').type("ADMIN");
    cy.get('[name="password"]').type("admin123");
    cy.get("button[type='submit']").click();

    //Wait for and verify the intercept
    cy.wait("@caseSensitiveUsername").then((interception) => {
      const requestBody = interception.request.body;
      expect(requestBody).to.include("username=ADMIN");
      expect(requestBody).to.include("password=admin123");
      expect(requestBody).to.include("_token=");

      // Verify successful response from original server
      expect(interception.response.statusCode).to.be.oneOf([200, 302]);
    });

    //Verify redirect to dashboard
    cy.url().should("include", "dashboard");
  });
  it("TC-009: Should fail login with case sensitive password", () => {
    //Intercept
    cy.intercept("POST", "**/auth/validate").as("caseSensitivePassword");

    cy.get('[name="username"]').type("Admin");
    cy.get('[name="password"]').type("ADMIN123");
    cy.get("button[type='submit']").click();

    //Wait for and verify the intercept
    cy.wait("@caseSensitivePassword").then((interception) => {
      const requestBody = interception.request.body;
      expect(requestBody).to.include("username=Admin");
      expect(requestBody).to.include("password=ADMIN123");
      expect(requestBody).to.include("_token=");

      // Verify successful response from original server
      expect(interception.response.statusCode).to.be.oneOf([200, 302]);
    });

    //Verification displays an invalid credential alert
    cy.get(".oxd-alert").should("be.visible").log("Invalid Credentials");
  });
  it("TC-010: Should fail login with case sensitive username and password", () => {
    //Intercept
    cy.intercept("POST", "**/auth/validate").as("bothCaseSensitive");

    cy.get('[name="username"]').type("ADMIN");
    cy.get('[name="password"]').type("ADMIN123");
    cy.get("button[type='submit']").click();

    //Wait for and verify the intercept
    cy.wait("@bothCaseSensitive").then((interception) => {
      const requestBody = interception.request.body;
      expect(requestBody).to.include("username=ADMIN");
      expect(requestBody).to.include("password=ADMIN123");
      expect(requestBody).to.include("_token=");

      // Verify successful response from original server
      expect(interception.response.statusCode).to.be.oneOf([200, 302]);
    });

    //Verification displays an invalid credential alert
    cy.get(".oxd-alert").should("be.visible").log("Invalid Credentials");
  });
  it("TC-011: Should fail login with spaces around username", () => {
    //Intercept
    cy.intercept("POST", "**/auth/validate").as("spacesUsername");

    cy.get('[name="username"]').type(" Admin");
    cy.get('[name="password"]').type("admin123");
    cy.get("button[type='submit']").click();

    //Wait for and verify the intercept
    cy.wait("@spacesUsername").then((interception) => {
      const requestBody = interception.request.body;
      expect(requestBody).to.include("username=+Admin");
      expect(requestBody).to.include("password=admin123");
      expect(requestBody).to.include("_token=");

      // Verify successful response from original server
      expect(interception.response.statusCode).to.be.oneOf([200, 302]);
    });

    //Verification displays an invalid credential alert
    cy.get(".oxd-alert").should("be.visible").log("Invalid Credentials");
  });
  it("TC-012: Should fail login with spaces around password", () => {
    //Intercept
    cy.intercept("POST", "**/auth/validate").as("spacesPassword");

    cy.get('[name="username"]').type("Admin");
    cy.get('[name="password"]').type(" admin123");
    cy.get("button[type='submit']").click();

    //Wait for and verify the intercept
    cy.wait("@spacesPassword").then((interception) => {
      const requestBody = interception.request.body;
      expect(requestBody).to.include("username=Admin");
      expect(requestBody).to.include("password=+admin123");
      expect(requestBody).to.include("_token=");

      // Verify successful response from original server
      expect(interception.response.statusCode).to.be.oneOf([200, 302]);
    });

    //Verification displays an invalid credential alert
    cy.get(".oxd-alert").should("be.visible").log("Invalid Credentials");
  });
  it("TC-013: Should fail login with spaces around username and password", () => {
    //Intercept
    cy.intercept("POST", "**/auth/validate").as("bothSpaces");

    cy.get('[name="username"]').type("Admin ");
    cy.get('[name="password"]').type(" admin123");
    cy.get("button[type='submit']").click();

    //Wait for and verify the intercept
    cy.wait("@bothSpaces").then((interception) => {
      const requestBody = interception.request.body;
      expect(requestBody).to.include("username=Admin+");
      expect(requestBody).to.include("password=+admin123");
      expect(requestBody).to.include("_token=");

      // Verify successful response from original server
      expect(interception.response.statusCode).to.be.oneOf([200, 302]);
    });

    //Verification displays an invalid credential alert
    cy.get(".oxd-alert").should("be.visible").log("Invalid Credentials");
  });
  it("TC-014: Should login successfully using keyboard Enter", () => {
    //Intercept
    cy.intercept("POST", "**/auth/validate").as("enterKeyLogin");

    cy.get('[name="username"]').type("Admin");
    cy.get('[name="password"]').type("admin123");
    cy.get('[name="password"]').type("{enter}");

    //Wait for and verify the intercept
    cy.wait("@enterKeyLogin").then((interception) => {
      const requestBody = interception.request.body;
      expect(requestBody).to.include("username=Admin");
      expect(requestBody).to.include("password=admin123");
      expect(requestBody).to.include("_token=");
      // Verify successful response from original server
      expect(interception.response.statusCode).to.be.oneOf([200, 302]);
    });

    //Verify redirect to dashboard
    cy.url().should("include", "dashboard");
  });
  it("TC-015: Should navigate through form fields using Tab Keyboard", () => {
    //Intercept
    cy.intercept("POST", "**/auth/validate").as("tabNavigation");

    //Focus on the first field (username)
    cy.get('[name="username"]').focus();
    cy.get('[name="username"]').should("have.focus");
    // Press Tab to move to the password field
    cy.get('[name="username"]').tab();
    cy.get('[name="password"]').should("have.focus");
    // Press Tab again to move to the Login button
    cy.get('[name="password"]').tab();
    cy.get("button[type='submit']").should("have.focus");

    // Verify no API call made during navigation
    cy.get("@tabNavigation.all").should("have.length", 0);
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
