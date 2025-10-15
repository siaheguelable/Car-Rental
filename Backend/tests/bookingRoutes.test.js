const request = require("supertest");
const app = require("../server"); // import your Express app

describe("booking API test to get all the bookings", () => {
  it("should return bookings", async () => {
    const res = await request(app).get("/api/bookings");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

// get only one booking

describe("booking API test to get only one booking", () => {
  it("should return a single booking", async () => {
    const bookingId = "68ed765dc2e9dabd7587b965";
    const res = await request(app).get(`/api/bookings/${bookingId}`);

    expect(res.statusCode).toBe(200);
    expect(typeof res.body).toBe("object"); // res.body itself is the booking
    expect(res.body).toHaveProperty("_id", bookingId);
  });
});
