import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/server';

import { User } from '../src/db/models';
import { getSecret } from '../src/helpers/speakeasy';

chai.should();
chai.use(chaiHttp);
const { expect } = chai;


describe('Auth tests', () => {
  before(() => {
    const email = ['john.doe@gmail.com', 'john.doe2@gmail.com'];
    email.map((i) => {
      const user = User.findOne({
        where: {
          email: i
        }
      });
      if (user) {
        User.destroy({
          where: {
            email: i
          }
        });
      }
    });
  });
  describe('User Controller', () => {
    const secret = getSecret();
    const defaultUser = {
      firstName: 'john',
      lastName: 'doe',
      email: 'john.doe@gmail.com',
      phoneNumber: '08139228639',
      password: 'password',
      pin: '1202',
      secret,
      accountBalance: 1000
    };
    it(('should signup a user'), (done) => {
       
      chai
        .request(app)
        .post('/api/user/signup')
        .send(defaultUser)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.message.should.be.a('string').eql(`Account created successfully, Your pin is ${pin}`);
          done();
        });
    });
  })
})