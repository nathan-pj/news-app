const db = require("../../db/connection");
const format = require("pg-format");
exports.showSpecificArticle = (id) => {
  var currentArticle;
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [id])
    .then(({ rows }) => {
      currentArticle = rows[0];
      if (!currentArticle) {
        return Promise.reject({ status: 404, msg: "article not found" });
      }
    })
    .then(() => {
      return db
        .query("SELECT * FROM comments WHERE article_id = $1", [id])
        .then((result) => {
          if (currentArticle === undefined) {
            return Promise.reject({
              status: 404,
              msg: `No user found for user_id: ${user_id}`,
            });
          }

          currentArticle.comment_count = result.rows.length;

          return currentArticle;
        });
    });
};

exports.showArticleComments = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article not found" });
      }
    })
    .then(() => {
      return db
        .query(`SELECT * FROM comments WHERE article_id = $1;`, [id])
        .then((result) => {
          return result.rows;
        });
    });
};

exports.updateArticle = (article_id, vote) => {
  if (vote === undefined) {
    return db
      .query(`SELECT * FROM articles WHERE article_id  = $1`, [article_id])
      .then((result) => {
        return Promise.resolve(result.rows[0]);
      });
  }
  if (typeof vote !== "number") {
    return Promise.reject({ status: 404, msg: "Invalid vote" });
  }

  return db
    .query(
      `UPDATE articles
      SET votes = votes + $1
                       WHERE article_id = $2`,
      [vote, article_id]
    )
    .then(() => {
      return db
        .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
        .then((result) => {
          if (result.rows.length === 0) {
            return Promise.reject({ status: 404, msg: "article not found" });
          }
          return result.rows[0];
        });
    });
};
exports.addArticle = (body, title, topic, author created_at) => {
  if (!body) {
    return Promise.reject({ status: 400, msg: "include body" });
  }
  if (!title) {
    return Promise.reject({ status: 400, msg: "include title" });
  }
  if (!topic) {
    return Promise.reject({ status: 400, msg: "include topic" });
  }
  if (!author) {
    return Promise.reject({ status: 400, msg: "include author" });
  }
  return db
    .query(`SELECT * FROM users WHERE username = $1;`, [author])
    .then(({ rows }) => {
      console.log(rows);
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "username does not exist",
        });
      }
    })
    .then(() => {
      const queryString = format(
        `INSERT INTO articles(body, title, topic, author, created_at)
        VALUES %L
        RETURNING *;`,
        [[body, title, topic, author, created_at]]
      );

      return db.query(queryString).then((response) => {
        return response.rows[0];
      });
    });
};
exports.addArticleComment = (id, comment, username) => {
  return db
    .query(`SELECT * FROM comments WHERE article_id = $1`, [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article not found" });
      }
    })
    .then(() => {
      if (!username) {
        return Promise.reject({ status: 400, msg: "please specify username" });
      }
      if (!comment) {
        return Promise.reject({ status: 400, msg: "please write a comment" });
      }
    })
    .then(() => {
      return db
        .query(`SELECT * FROM users WHERE username = $1`, [username])
        .then(({ rows }) => {
          if (rows.length === 0) {
            return Promise.reject({
              status: 404,
              msg: "username does not exist",
            });
          }
        });
    })
    .then(() => {
      const queryStr = format(
        `INSERT INTO comments(author, article_id, body)
          VALUES %L
          RETURNING *;`,
        [[username, id, comment]]
      );

      return db.query(queryStr).then((response) => {
        return response.rows[0];
      });
    });
};

exports.showArticles = ({ sort_by = "created_at", order = "DESC", topic }) => {
  if (
    ![
      "author",
      "title",
      "article_id",
      "topic",
      "created_at",
      "votes",
      "comment_count",
    ].includes(sort_by)
  ) {
    return Promise.reject({ status: 400, msg: "invalid sort by query" });
  }
  if (!["DESC", "ASC"].includes(order)) {
    return Promise.reject({ status: 400, msg: "invalid order query" });
  }

  let queryStr = `SELECT articles.*, COUNT(comments.article_id) AS comment_count
                FROM articles
                LEFT JOIN comments
                ON comments.article_id = articles.article_id`;

  queryStr += ` GROUP by articles.article_id
      ORDER BY ${sort_by} ${order};`;
  return db
    .query(`SELECT * FROM articles WHERE topic = $1;`, [topic])
    .then(({ rows }) => {
      if (topic) {
        if (rows.length === 0) {
          return Promise.reject({
            status: 404,
            msg: `topic '${topic}' doesn't exist`,
          });
        }
      }
    })
    .then(() => {
      return db.query(queryStr).then(({ rows }) => {
        return rows;
      });
    });
};
