const eventsController = require("./../controllers/events_controller");
const EventModel = require("./../database/models/event_model");
const httpMocks = require('node-mocks-http');
const request = require("supertest");
const app = require("./../app");

describe('Test events routes', () => {
  test('GET - "/events" response is defined', () => {
    const request = httpMocks.createRequest({
      method: 'GET',
      url: '/events'
    });
    const response = httpMocks.createResponse();

    eventsController.index(request, response, (err) => {
      expect(err).toBeFalsy();
    });

    let data = response._getData();

    expect(data).toBeDefined();
  });

  
});

// test('/events returns 200', () => {
//   //jest.setTimeout(30000);
//   return request(app).get("/events").expect(200);
// });