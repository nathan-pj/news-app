const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app/app");
beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/topics ", () => {
  test("200 - receive object of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(typeof body).toBe("object");
        expect(Object.keys(body)[0]).toBe("topics");
        expect(Object.keys(body.topics[0])[0]).toBe("slug");
        expect(Object.keys(body.topics[0])[1]).toBe("description");
      });
  });
  test("404 - receive error for invalid path", () => {
    return request(app)
      .get("/api/notAPath")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("path unknown");
      });
  });
});

describe("GET /api/articles/:article_id ", () => {
  test("200 - receive specific article object and shows amount of comments with that article_id ", () => {
    const article_id = 9;
    return request(app)
      .get(`/api/articles/${article_id}`)
      .expect(200)
      .then(({ body }) => {
        expect(typeof body).toBe("object");
        expect(Object.keys(body)[0]).toBe("article");
        expect(body.article.comment_count).toBe(2);
        expect(body.article.created_at).toBe("2020-06-06T09:10:00.000Z");
      });
  });
  test("400 - receive error for invalid ID", () => {
    return request(app)
      .get("/api/articles/notAnID")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid path");
      });
  });
  test("404 - receive error for non-existent ID", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("article not found");
      });
  });
});

describe("PATCH /api/articles/:article_id ", () => {
  test("201 - update specific article vote", () => {
    const newVote = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/3")

      .send(newVote)
      .expect(201)
      .then(({ body }) => {
        expect(body.article.votes).toBe(1);
      });
  });

  test("400 - invalid ID", () => {
    const newVote = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/notAnID")

      .send(newVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid path");
      });
  });

  test("400 - invalid vote", () => {
    const invalidVote = { inc_votes: "invalid" };
    return request(app)
      .patch("/api/articles/3")
      .send(invalidVote)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid vote");
      });
  });

  test("404 - non-existent ID", () => {
    const newVote = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/9999")

      .send(newVote)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article not found");
      });
  });
  test("200 - missing inc_votes key, no effect", () => {
    const noVote = { no_vote: "novote" };
    return request(app)
      .patch("/api/articles/3")

      .send(noVote)
      .expect(200)
      .then(({ body }) => {
        expect(body.article.votes).toBe(0);
      });
  });
});

describe("GET /api/articles/", () => {
  test("200 - receive all articles with comment count", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(typeof body).toBe("object");
        expect(body.articles[0].created_at).toBe("2020-11-03T09:12:00.000Z");
        expect(body.articles[0].count).toBe("2");
      });
  });
  test("200 - sort by title in descending order", () => {
    return request(app)
      .get("/api/articles?sort_by=title&&order=DESC")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].title).toBe("Z");
      });
  });
  test("200 - set topic", () => {
    return request(app)
      .get("/api/articles?sort_by=title&&order=DESC&&topic=mitch")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].topic).toBe("mitch");

        expect(body.articles[body.articles.length - 1].topic).toBe("mitch");
      });
  });

  test("200 - set order to ASC", () => {
    return request(app)
      .get("/api/articles?sort_by=title&&order=ASC")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].title).toBe("A");
      });
  });

  test("400 - invalid sort_by query", () => {
    return request(app)
      .get("/api/articles?sort_by=INVALID")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("invalid sort by query");
      });
  });

  test("400 - invalid order query", () => {
    return request(app)
      .get("/api/articles?order=INVALID")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("invalid order query");
      });
  });
  test("404 - topic query doesn't exist", () => {
    return request(app)
      .get("/api/articles?topic=banana")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("topic 'banana' doesn't exist");
      });
  });
});

describe("GET /api/articles/:article_id/comments ", () => {
  test("200 - get specific article comments", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments).toBeInstanceOf(Array);
        expect(response.body.comments).toHaveLength(11);
      });
  });

  test("400 - invalid article ID", () => {
    return request(app)
      .get("/api/articles/notAnArticle/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid path");
      });
  });

  test("404 - ID not found", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("article not found");
      });
  });

  test("200 - responds with empty array if no comments for article", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments).toBeInstanceOf(Array);
        expect(response.body.comments).toHaveLength(0);
      });
  });
});

describe("POST /api/articles/:article_id/comments ", () => {
  test("201 - able to post comment ", () => {
    const postComment = { username: "butter_bridge", body: "nice article" };
    return request(app)
      .post("/api/articles/3/comments")
      .send(postComment)
      .expect(201)
      .then((response) => {
        expect(response.body.comment).toHaveProperty("author");
        expect(response.body.comment).toHaveProperty("body");
      });
  });
  test("400 - invalid ID", () => {
    return request(app)
      .post("/api/articles/NotAnID/comments")
      .send({ username: "butter_bridge", body: "nice article" })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid path");
      });
  });
  test("404 - non-existant ID", () => {
    return request(app)
      .post("/api/articles/9999/comments")
      .send({ username: "butter_bridge", body: "nice article" })
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("article not found");
      });
  });
  test("400 - missing username", () => {
    return request(app)
      .post("/api/articles/3/comments")
      .send({ username: "", body: "nice article" })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("please specify username");
      });
  });

  test("400 - missing body", () => {
    return request(app)
      .post("/api/articles/3/comments")
      .send({ username: "butter_bridge", body: "" })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("please write a comment");
      });
  });

  test("404 - username does not exist", () => {
    return request(app)
      .post("/api/articles/3/comments")
      .send({ username: "not_a_user", body: "hi" })
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("username does not exist");
      });
  });
  test("201 - ignores unnecessary properties", () => {
    return request(app)
      .post("/api/articles/3/comments")
      .send({ username: "butter_bridge", body: "hi", uselessProperty: 2 })
      .expect(201)
      .then((response) => {
        expect(response.body.comment).toHaveProperty("author");
        expect(response.body.comment).not.toHaveProperty("uselessProperty");
      });
  });
});

describe("DELETE /api/comments/:comment_id ", () => {
  test("204 - delete comment", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then((response) => {
        expect(response.status).toBe(204);
      });
  });
  test("400 - invalid path", () => {
    return request(app)
      .delete("/api/comments/INVALID")
      .expect(400)
      .then((response) => {
        expect(response.status).toBe(400);
      });
  });
});

describe("GET /api ", () => {
  test("get all endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(typeof response).toBe("object");
        expect(response.body).toHaveProperty("GET /api");
        expect(response.body).toHaveProperty("GET /api/topics");
        expect(response.body).toHaveProperty("GET /api/articles");
        expect(response.body).toHaveProperty("GET /api/articles/:article_id");
        expect(response.body).toHaveProperty(
          "PATCH /api/articles/:article_id/comments"
        );
        expect(response.body).toHaveProperty(
          "DELETE /api/comments/:comment_id"
        );
      });
  });
});
