const request = require("supertest");
const app = require("../server"); // import your Express app

describe("admin API test to get all the admin", () => {
  it("should return admin users", async () => {
    const res = await request(app).get("/api/admin");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

// get only one admin

describe("admin API test to get only one admin", () => {
  it("should return a single admin", async () => {
    const adminId = "68f00550f03ccdc019c865b5";
    const res = await request(app).get(`/users/${adminId}`);

    if (res.statusCode === 200) {
      // only check if the admin exists
      expect(typeof res.body).toBe("object");
      expect(res.body).toHaveProperty("_id", adminId);
    } else {
      expect(res.statusCode).toBe(404); // admin not found
    }
  });
});
