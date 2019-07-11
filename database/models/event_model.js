const mongoose = require("mongoose");
const eventSchema = require("./../schemas/event_schema");

const eventModel = mongoose.model("event", eventSchema);

module.exports = eventModel;
