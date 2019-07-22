const eventsController = require("./../controllers/events_controller");
const EventModel = require("./../database/models/event_model");

test('eventsController.index returns an array', () => {
  expect(eventsController.index).toContain();
});