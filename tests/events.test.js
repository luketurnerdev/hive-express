const request = require("supertest");
const app = require("./../app");

test('eventsController.index returns 200', () => {
  return request(app).get("/events").expect(200);
  //expect(eventsController.index).toContain();
});