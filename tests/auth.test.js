const request = require("supertest");
const app = require("../index");
const users = require('../helpers/users')

describe("Auth route", () => {

    const body = {
        username: "username",
        email: "email@example.com",
        password: "password"
    }

    const user = {
      id: expect.any(Number),
      username: body.username,
      password: expect.any(String),
      email: body.email,
      cart_id: null,
    };

    afterEach(async () => {
      const userToDelete = await users.getUserByEmail(body.email);
      if (userToDelete) {
        await users.deleteUserById(userToDelete.id);
      }
    });

    describe(" POST /register", () => {

        let res;

        beforeAll(async () => {
          res = await request(app).post("/auth/register").send(body);
        });

        describe("if given a username, email and password", () => {

            it("should return HTTP status code 201", async () => {
              expect(res.statusCode).toBe(201);
            });

            it("should return user information in response body", () => {
              expect(res.body).toEqual(user);
            });
        })
        
    })
})