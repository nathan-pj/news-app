Welcome to my News API.

This project uses controllers and models to interact with a test/development database and process different 'express' requests such as GET, POST etc with different paths.

To run the tests, first fork my github link, then copy the clone link and run 'git clone <link>' into the terminal, and then 'npm install' to install the dependencies.

You will need to create two .env files for this project: .env.test and .env.development. Into each, add PGDATABASE=<database_name_here>, with the correct database name for that environment (see /database/setup.sql for the database names).

Minimum node and postgres versions:

node: v14.18.0
postgres: 14.1

To use the development data, make a file called '.env.development' and write 'PGDATABASE=nc_news' and then change line 2 of ./db/connection.js and replace 'test' with development.
To use the test data, make a file called '.env.test' and write 'PGDATABASE=nc_news_test'

Finally, you can view it on heroku here:
https://nc-news-npj.herokuapp.com/api
