# Sing No Ism - https://sing-no-ism.herokuapp.com/

A genEquality Hackathon project using Node.js, Express, Postgres, Sequelize, React, and Redux. For testing, Mocha & Chai. Style? SCSS!

# MVP condition:
_Users can visit a deployed production site, and listen a song using the application. The application has to return info about that song, plus its "ism" rating scale. When logged-in, the users have to be able to rate either abusive words or terms in a song lyrics. The application have to learn from these ratings and identify the same pattern in other lyrics._


# Project Description:
_Name:_ Sing no Ism
_Idea:_ "Ism" rating scale for song lyrics
_Isms: [Racism, Sexism, Classism, Ableism, Anti-Semitism, Ageism and Heterosexism]_
_Category:_ [Gender equality in culture]
_Why:_ Sometimes we listen to music without realize how aggressive it is. Our subconscious absorbs all these "hidden" messages.  The app will show it, raising awareness about the issue.

## Starting the application:
  1. Create two databases using `Postgres` command line:
    - `createdb sing-no-ism`
    - `createdb sing-no-ism-test`
  2. `npm install`
  3. `npm run start-dev`
  4. Enjoy it on localhost:4321.

## Testing it:
  `npm test`
  _When touching the db inside tests, it's necessary to hook db.sinc({force:true}) before all tests_

## Deploying it (manually, using heroku):
  1. Add the heroku app as a remote:
  `heroku git:remote sing-no-ism`
  2. Rename your remote name:
  `git remote rename heroku production`
  3. Run the depoloy script:
  `npm run deploy`
  Your terminal will ask you the __branch__ you want to deploy and the __remote__ to receive it.

  There is a dev heroku app, in case you want to test a branch in the heroku enviroment:
  `heroku git:remote sing-no-ism-app`
  `git remote rename heroku dev`
  `npm run deploy`
