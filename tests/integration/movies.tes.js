const request = require("supertest");
const Genre = require("../../models/movie");
const User = require("../../models/user");
let server;

describe("/api/genres", () => {
  beforeEach(() => {
    server = require("../../index");
  });

  afterEach(async () => {
    await server.close();
    await Genre.deleteMany({});
  });

  describe("GET /", () => {
    it("should return all genres", async () => {
      await Genre.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" },
      ]);
      const res = await request(server).get("/api/genres");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((genre) => genre.name === "genre1")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return a genre if valid id is passed", async () => {
      const genre = await Genre.create({ name: "genre1", genre: "horror" });

      const res = await request(server).get(`/api/genres/${genre._id}`);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        _id: genre._id.toHexString(),
        name: genre.name,
      });
    });

    it("should return response 404 and throw error if invalid id is passed", async () => {
      const res = await request(server).get("/api/genres/1");
      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    it("should return response 401 if user is not logged in", async () => {
      const res = await request(server)
        .post("/api/genres/")
        .send({ name: "genre1" });
      expect(res.status).toBe(401);
    });

    it("should return response 400 if genre or name is less than 5 characters or missing or actor is missing", async () => {
      const token = new User().generateAuthToken();
      const res = await request(server)
        .post("/api/genres/")
        .set("x-auth-token", token)
        .send({
          name: "genre",
          genre: "horror",
        });
      expect(res.status).toBe(400);
    });

    it("should save movie if it is valid and return response 200", async () => {
      const token = new User().generateAuthToken();
      const res = await request(server)
        .post("/api/genres/")
        .set("x-auth-token", token)
        .send({
          name: "genre",
          genre: "horror",
          actors: ["6658fd668b2bf9c04fb06234"],
        });

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ name: "genre" });
    });
  });
});
