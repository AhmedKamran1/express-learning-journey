const request = require("supertest");
const Rental = require("../../models/rental");
const Movie = require("../../models/movie");
const User = require("../../models/user");
const mongoose = require("mongoose");
const moment = require("moment");

let server;

describe("/api/returns", () => {
  let rental;
  let movie;
  let customerId = new mongoose.Types.ObjectId();
  let movieId = new mongoose.Types.ObjectId();

  beforeEach(async () => {
    server = require("../../index");
    // movie = new Movie({
    //   _id: movieId,
    //   title: "12345",
    //   dailyRentalRate: 2,
    //   genre: { name: "12345" },
    //   numberInStock: 10,
    // });

    // await movie.save();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: "ahmed",
        phone: "12345",
      },
      movie: {
        _id: movieId,
        title: "movie title",
        dailyRentalRate: 2,
      },
    });
    await rental.save();
  });

  afterEach(async () => {
    await server.close();
    await Rental.deleteMany({});
  });

  it("should return 401 if client is not logged in", async () => {
    const res = await request(server)
      .post("/api/returns")
      .send({ customerId, movieId });
    expect(res.status).toBe(401);
  });

  it("should return 400 if customerId is not provided", async () => {
    const token = new User().generateAuthToken();

    const res = await request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ movieId });
    expect(res.status).toBe(400);
  });

  it("should return 400 if movieId is not provided", async () => {
    const token = new User().generateAuthToken();

    const res = await request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId });
    expect(res.status).toBe(400);
  });

  it("should return 404 if no rental found for the customer/movie", async () => {
    await Rental.deleteMany({});
    const token = new User().generateAuthToken();

    const res = await request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId, movieId });
    expect(res.status).toBe(404);
  });

  it("should return 400 if return is processed", async () => {
    rental.dateReturned = new Date();
    await rental.save();
    const token = new User().generateAuthToken();

    const res = await request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId, movieId });
    expect(res.status).toBe(400);
  });

  it("should return 200 if valid request", async () => {
    const token = new User().generateAuthToken();
    const res = await request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId, movieId });
    expect(res.status).toBe(200);
  });

  it("should set return date if input is valid", async () => {
    const token = new User().generateAuthToken();
    const res = await request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId, movieId });

    const rentalInDb = await Rental.findById(rental._id);
    expect(rentalInDb.dateReturned).toBeDefined();
  });

  it("should set rentalFee if input is valid", async () => {
    rental.dateOut = moment().add(-7, "days").toDate();
    await rental.save();
    const token = new User().generateAuthToken();
    const res = await request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId, movieId });

    const rentalInDb = await Rental.findById(rental._id);
    expect(rentalInDb.rentalFee).toBe(14);
  });
});
