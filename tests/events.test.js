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

  // test('GET - "/events/:group/:id" response is defined', () => {
  //   const request = httpMocks.createRequest({
  //     method: "GET",
  //     url: "/events/:group/:id",
  //     params: {
  //       id: "260841077",
  //       group: "GraphQL-Sydney"
  //     },
  //     cookies: {
  //       tokens: {
  //         access_token: "5623b337d9685b4d0b350aacca7d57c2"
  //       }
  //     }
  //   });
  //   const response = httpMocks.createResponse();

  //   eventsController.index(request, response, (err) => {
  //     expect(err).toBeFalsy();
  //   });

  //   let { name } = response._getData();

  //   let expected = { "name": "GraphQL Sydney" }
  //   expect(name).toMatchObject(expected);
  // });
});
