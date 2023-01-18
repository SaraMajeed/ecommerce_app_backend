const request = require("supertest");
const app = require("../index");


describe("Users route", () => {

    let res;

     const body = {
       username: "username",
       email: "email@example.com",
       password: "password",
     };

    const user = {
      id: expect.any(Number),
      username: body.username,
      password: expect.any(String),
      email: body.email,
      cart_id: null,
    };

    beforeAll(async () => {
      await request(app).post("/auth/register").send(body)
      res = await request(app).get("/users");
    });

    describe("GET /users", () => {

        it("should return HTTP status code 200",  () => {
            expect(res.statusCode).toBe(200)
        })

        it("should return list of users in JSON", () => {
            expect.objectContaining({user});
        })
    })

    describe("GET /users/:id", () => {

        beforeAll(async () => {
            res = await request(app).get("/users");
            const userId = res.body[0].id;
            res = await request(app).get(`/users/${userId}`);
        });

        it("should return HTTP status code 200", () => {
          expect(res.statusCode).toBe(200);
        });
    })

})