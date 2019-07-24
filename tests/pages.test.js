const request = require("supertest");
const app = require("./../app");

describe("Test the root path", () => {
  test("Response to a GET request should be 200(ok) status.", () => {
    return request(app).get("/").expect(200);
  });
});