

Writting unit tests for a full stack application using Mocha and Chai
## First things first…

When we are talking about automated testing, TDD (test driven development) should be the answer. Period. Write the test, see it failing, write the minimum amount of coding to pass it, run the test and see it passing, refactor the code, repeat. No secret, right? However, the reality can be different. Maybe you won’t have the change to start all your projects from scratch, writing testing before you write the code. Or maybe you don’t have a good specification to follow, and you just learn what you are coding on the fly. Or sometimes the time pressure to finish a project doesn’t give you room to work on it. That’s real life. For that reason, I decided to write unit tests for a full stack application already built that I developed during the senior phase at FullStack Academy.

The application is a SPA (simple page application), built to help Brazilian voters to follow their politicians. It accesses external APIs provided by the Brazilian government to fetch information about representatives and presents it to the general public in a friendly way. The project link on GitHub is here and my presentation is here. It was built on Javascript using Node.js. For the back end, I used Express to manage the API routes and Sequelize to manage the database that I had to create in order to tie some of the information fetched from the public APIs. React and Redux were used in he front end.

## Define the golden rules...
1) Test behavior, not implementation. --> Implementation can change over time. Maybe you just figure out a better and more optimized way to do something. Your test should be bored by that. In the other hand, if the behavior change, probably something you will stop to work.
2) Make sure the test can fail. --> Sometimes javascript can trick us. We see the test passing, but maybe we just put


To write the tests, I'll use Mocha and Chai. Mocha provides the ability to define and execute tests from the command line, but doesn’t have an assertion library. That's when Chai comes handy.

To get started, let's install both Mocha and Chai as development dependency on the project, that way every body can have it installed when working in the project.

`npm install --save-dev mocha chai`

Also, in order to run the tests on the command line, let's add a test script on package.jason

```js
  "scripts": {
      "test:server": "NODE_ENV='test' mocha tests/server-tests",
      "test:client": "NODE_ENV='test' mocha tests/client-tests --require babel-core/register --require tests/client-tests/setup.js",
      "test": "npm run test:server & npm run test:client"
```
ps To avoid touching the production database, it's important to assign NODE_ENV='test' and create a alternative database to be sync when running tests. Then when defining a new Sequelize instance, you can do something like that:

```js
      const Sequelize = require('sequelize')
      const dbName = 'follow-your-politician' + process.env.NODE_ENV === 'test' ? '-test' : ''
      const db = new Sequelize(`postgres://localhost:5432/${dbName}`, {
        logging: false // true: log the events in the database
      })
      module.exports = db
```
Where to write tests?
I personally like to have a separeted structure to store the tests. If you prefer to keep it alongside the modules, just remember to change the command lines on script to run the right module.

## Testing Models (Sequelize)
Setup:

```js
const { db } = require('../../server/db');
const Party = db.models.party
const chai = require('chai')
const expect = chai.expect
const chaiAsPromised = require('chai-as-promised'); //await expect to.be rejected
chai.use(chaiAsPromised)
```
The model Party has some fields that helps to tie together the info fetched from an external API. There isn't any logic to be tested here, like a manually validation or class or instance methods. You you have that, you definitely must write test for them. However, it's important to raise errors with some other developer decided to change the fields and made then not required (`allowNull: false`). It seams we are testing things that Sequelize is responsible to raise errors. However, using testing as a way to document the project is also a good practice. Moreover, the associations between tables it's a good point to be tested. A good approach to tackle async functions here is to use `chaiAsPromised`. It allows us to make assertions as `to.be.fulfilled` and `to.be.rejected`.

To make sure we are using a cleaning table every single test, we use the Mocha's hooks `beforeEach` and `afterEach`.

```js
      describe('The party model', () => {
        beforeEach('sync DB', () => {
          db.sync();
        });
        afterEach('truncate model', () => {
          Party.truncate();
        });
```
To test the required fields, I created two instances, one that has all the required fields and the other doesn't. We expect to the first be fulfilled and the former to be reject.
```js
        describe('has required fields', () => {
          it('shortName and electoralNumber', async () => {
            const PartyShouldCreate = Party.build({
              shortName: 'niceParty',
              electoralNumber: 98,
            });
            const PartyShouldntCreate = Party.build({ name: 'failParty' });
            await expect(PartyShouldCreate.save()).to.be.fulfilled;
            await expect(PartyShouldntCreate.save()).to.be.rejected;
          });
```
To make sure the test can fail, I comment out the validations on the source code and run the test.

pic#1 and we failed!

Then I uncomment the source code and run test again.

pic#2 Now we passed

To test the association, I create a new party, without an allianceId, a new alliance and use the method `.setAlliance`, only available when there is an association between the tables. Then, we expect that the new Party created has allianceId as a property equals the alliance.id we just created.
```js
          describe('belongsTo Alliance through associations', () => {
            it('and has setAlliance as a method', async () => {
              const PartyWithAlliance = await Party.create({shortName: 'niceParty', electoralNumber: 98})
              const alliance = await Alliance.create({name: 'niceAlliance'})
              PartyWithAlliance.setAlliance(alliance)
              expect(PartyWithAlliance.allianceId).to.be.equal(alliance.id)
            });
          });
        });
      });
```
To see it failing, I comment out the associations.
pic#3

Put everything back to place, an run the test again.
pic#4

##Testing Middlewares (Express)
Since most of the data comes from an external API, I just had to set up one route to get the basic information on the database. That will be fine to show the power of `Supertest`.
Testing routes is very straightforawrd. We send a resquest and evaluate the response. `Supertest` is a tool that comes on handy. It simulates a server side and give us the power to send CRUD requests. It also accepts promises! Super!

`npm i --save-dev supertest`

Here is the innitial setup:

```js
const supertest = require('supertest')
const app = require('../../server/index')
const client = supertest(app)
const { expect } = require('chai')
const { Party } = require('../../server/db')
```

Note that it's important to require also the model here, since I will have to simulate the access to the database. And to make sure we are working with a clean database, let's hook!

```js
beforeEach('sync DB', () => {
    db.sync();
  });
  afterEach('truncate model', () => {
    Party.truncate();
    Alliance.truncate({cascade:true})
  });
```

To test if the route is working properly, I created some parties and an alliance in to the database. Using the fake client, aka supertest, I made a GET request. Then I tested the status it returned, the type of the response and if all the parties I created before were included in the response.

```js
it('responds with 200 and all parties and alliances in the database', async () => {
    const partyCreations = [
      Party.create({shortName: 'party0', electoralNumber:0}),
      Party.create({shortName: 'party1', electoralNumber:1}),
      Alliance.create({name: 'niceAliiance'})
    ]
    await Promise.all(partyCreations)
    const response = await client.get('/api/parties')
    const [parties, alliance] = response.body
    expect(response.status).to.be.equal(200)
    expect(response.body).to.be.an('array')
    parties.forEach((party, idx) =>{
      expect(party).to.have.property('shortName', `party${idx}`)
    })
  })
```

Following the golden rules, I changed the source code and run the test, expecting to fail.

pic#5
Sucess! (or fail, whatever...).

Back to the original code and...
pic#6



