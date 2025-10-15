const request = require("supertest");
const app = require("../server"); // import your Express app

describe("Car API Tests", () => {
  it("should return all cars", async () => {
    const res = await request(app).get("/api/cars");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

// get only one user

describe("car API test to get only one car", () => {
  it("should return a single car", async () => {
    const carId = "68e70e51131aa26c484fd126";
    const res = await request(app).get(`/api/cars/${carId}`);

    expect(res.statusCode).toBe(200);
    expect(typeof res.body).toBe("object"); // res.body itself is the car
    expect(res.body).toHaveProperty("_id", carId);
  });
});
