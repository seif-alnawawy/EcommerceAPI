/* eslint-disable no-undef */
const expect = require("chai").expect;

const { checkAuthorization } = require("../controllers/auth-controllers");

describe("Check authorization middleware", () => {
  it("should throw an error if no headers valid", () => {
    const req = {
      headers: {
        authorization: null,
      },
    };
    expect(checkAuthorization.bind(this, req, {}, () => {})).to.throw();
  });
  it("should throw an error if the auth header is only one string", () => {
    const req = {
      headers: {
        authorization: "xyz",
      },
    };
    expect(checkAuthorization.bind(this, req, {}, () => {})).to.throw(
      "Not authorized",
    );
  });
    
});
