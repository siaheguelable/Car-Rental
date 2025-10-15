const request = require("supertest");
const app = require("../server"); // import your Express app
// get all the users
describe("user API test to get all the users", () => {
  it("should return  users", async () => {
    const res = await request(app).get("/users");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

// get only one user

describe("user API test to get only one user", () => {
  it("should return  a single user", async () => {
    const userId = "68e591fc41571553c0f16b82";
    const res = await request(app).get(`/users/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data");

    expect(typeof res.body.data).toBe("object"); // single user should be an object
    expect(res.body.data).toHaveProperty("_id", userId); // check correct user is returned
  });
});
