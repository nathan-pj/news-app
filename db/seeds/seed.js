const db = require("../connection");
const format = require("pg-format");
const seed = (data) => {
  const { articleData, commentData, topicData, userData } = data;
  return (
    db
      //TOPICS
      .query(
        `
      DROP TABLE IF EXISTS comments;`
      )
      .then(() => {
        return db.query(`DROP TABLE IF EXISTS articles;`);
      })
      .then(() => {
        return db.query(`DROP TABLE IF EXISTS topics;`);
      })

      .then(() => {
        return db.query(`DROP TABLE IF EXISTS users;`);
      })
      .then(() => {
        return db.query(
          `CREATE TABLE topics(slug TEXT PRIMARY KEY, description VARCHAR(255));`
        );
      })

      .then(() => {
        return db.query(
          `CREATE TABLE users(username VARCHAR(50) PRIMARY KEY, avatar_url VARCHAR(255), name TEXT);`
        );
      })

      .then(() => {
        return db.query(
          `CREATE TABLE articles(
              article_id SERIAL PRIMARY KEY, 
              title TEXT NOT NULL,
              body VARCHAR(2000) NOT NULL, 
              votes INT DEFAULT 0 NOT NULL, 
              topic TEXT REFERENCES topics(slug) NOT NULL,
              author VARCHAR(50) NOT NULL REFERENCES users(username) ,
              created_at TIMESTAMP);`
        );
      })

      .then(() => {
        return db.query(
          `CREATE TABLE comments(
        comment_id SERIAL PRIMARY KEY,
        author VARCHAR(50) REFERENCES users(username) ON DELETE CASCADE NOT NULL,
        article_id INT REFERENCES articles(article_id) ON DELETE CASCADE NOT NULL,
        votes INT DEFAULT 0 NOT NULL, 
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        body VARCHAR(2000) NOT NULL
 
      );`
        );
      })

      .then(() => {
        const formattedTopicData = topicData.map((topic) => [
          topic.slug,
          topic.description,
        ]);

        const insertTopicData = format(
          `
      INSERT INTO topics
      (slug, description)
      VALUES %L
      RETURNING*;`,
          formattedTopicData
        );

        return db.query(insertTopicData);
      })
      //USERS

      .then(() => {
        const formattedUserData = userData.map((user) => [
          user.username,
          user.avatar_url,
          user.name,
        ]);

        const insertUserData = format(
          `
        INSERT INTO users
        (username, avatar_url, name)
        VALUES %L
        RETURNING*;`,
          formattedUserData
        );
        return db.query(insertUserData);
      })

      //ARTICLES

      //
      .then(() => {
        const formattedArticleData = articleData.map((article) => [
          article.title,
          article.topic,
          article.author,
          article.body,
          article.created_at,
        ]);

        const insertArticleData = format(
          `
      INSERT INTO articles
      (title, topic, author, body, created_at)
      VALUES %L
      RETURNING*;`,
          formattedArticleData
        );
        return db.query(insertArticleData);
      })

      //COMMENTS

      .then(() => {
        const formattedCommentData = commentData.map((comment) => [
          comment.author,
          comment.article_id,
          comment.created_at,
          comment.body,
        ]);
        const insertCommentData = format(
          `
        INSERT INTO comments(author, article_id, created_at, body)
        VALUES %L
        RETURNING*;`,
          formattedCommentData
        );
        return db.query(insertCommentData);
      })
  );
};

module.exports = seed;
