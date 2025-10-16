const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../server"); // or "../app" if you split app/server
const Booking = require("../models/bookingModel");

describe("booking API test", () => {
  let bookingId;

  beforeAll(async () => {
    // optionally connect to test DB if not connected in app
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URL);
    }
  });

  afterAll(async () => {
    await Booking.deleteMany({}); // clean up test bookings
    await mongoose.connection.close();
  });

  test("should create a booking", async () => {
    const res = await request(app)
      .post("/api/bookings")
      .send({
        pickupLocation: "Abidjan Airport",
        dropoffLocation: "Cocody",
        totalPrice: 100,
        car: "64f0f6b5e5c0f1d0a1234567", // must be a valid ObjectId in DB
        user: "64f0f6b5e5c0f1d0a7654321", // valid ObjectId
        startDate: new Date(),
        endDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // +1 day
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    bookingId = res.body._id;
  });

  test("should return a single booking", async () => {
    const res = await request(app).get(`/api/bookings/${bookingId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("_id", bookingId);
  });
});
