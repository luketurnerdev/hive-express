const eventsController = require("./../controllers/events_controller");
const EventModel = require("./../database/models/event_model");
const request = require("supertest");
const app = require("./../app");

test('/events returns 200', () => {
  return request(app).get("/events").expect(200);
  //expect(eventsController.index).toContain();
});