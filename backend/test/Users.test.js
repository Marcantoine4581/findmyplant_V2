const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const User = require('../models/User');
var expect = require('chai').expect
var should = require('chai').should();

chai.use(chaiHttp);

before((done) => {
  User.deleteMany()
    .then(() => {
      console.log('Cleaned database');
      done();
    });
})

after((done) => {
  User.deleteMany()
    .then((result) => {
      console.log(result);
      done();
    });
})

describe('/ Test User Collection', () => {
  var userId = '';
  var token = '';
  it('test getAllUser', (done) => {
    chai.request(server)
      .get('/api/user')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });


  it('should verify that we have 0 user in the DB', (done) => {
    chai.request(server)
      .get('/api/user')
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.user.length).to.be.eql(0);
        done();
      });
  });

  it('should test the password length', (done) => {

    const user = {
      "userName": "Maurice",
      "email": "maurice@gmail.com",
      "password": "123",
      "adress": {
        "street": "",
        "city": "Paris",
        "postalCode": "75010",
        "country": ""
      }
    }
    chai.request(server)
      .post('/api/auth/signup')
      .send(user)
      .end((err, res) => {
        res.should.have.status(400);
        const actualMessage = res.body.message;
        expect(actualMessage).to.be.equal('Le mot de passe doit avoir au moins 6 caractères.');
        done();
      });
  });


  it('should POST a valid user', (done) => {

    const user = {
      "userName": "Maurice",
      "email": "maurice@gmail.com",
      "password": "123456",
      "adress": {
        "street": "",
        "city": "Paris",
        "postalCode": "75010",
        "country": ""
      }
    }
    chai.request(server)
      .post('/api/auth/signup')
      .send(user)
      .end((err, res) => {
        res.should.have.status(201);
        const actualMessage = res.body.message;
        expect(actualMessage).to.be.equal('Bienvenue Maurice');
        done();
      });
  });


  it('test if user email already exist', (done) => {

    const user = {
      "userName": "Maurice",
      "email": "maurice@gmail.com",
      "password": "123456",
      "adress": {
        "street": "",
        "city": "Paris",
        "postalCode": "75010",
        "country": ""
      }
    }
    chai.request(server)
      .post('/api/auth/signup')
      .send(user)
      .end((err, res) => {
        res.should.have.status(409);
        const actualMessage = res.body.message;
        expect(actualMessage).to.be.equal('Cet e-mail est déjà utilisé.');
        done();
      });
  });

  it('test the login', (done) => {

    const login = {
      "email": "maurice@gmail.com",
      "password": "123456"
    }
    chai.request(server)
      .post('/api/auth/login')
      .send(login)
      .end((err, res) => {
        console.log('this runs the login part');
        res.body.should.be.an('object');
        token = res.body.token;
        userId = res.body.userId;

        const userUpdate = {
          "userName": "Jean",
          "email": "maurice@gmail.com",
          "password": "123456",
          "adress": {
            "street": "10 rue de la tour",
            "city": "Paris",
            "postalCode": "75010",
            "country": "France"
          }
        }
        chai.request(server)
          .put(`/api/user/${userId}`)
          .set("Authorization", `Bearer ${token}`)
          .send(userUpdate)
          .end((err, res) => {
            console.log('this runs the update user part');
            res.should.have.status(200);
            const actualMessage = res.body.message;
            expect(actualMessage).to.be.equal('Profil mis à jour avec succès');
            done();
          });
        
      });
  });


  it('should verify that we have 1 user in the DB', (done) => {
    chai.request(server)
      .get('/api/user')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.user.length.should.be.eql(1);
        done();
      });
  });

  it('should delete the user in the DB', (done) => {
    chai.request(server)
      .delete(`/api/user/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        res.should.have.status(200);
        const actualMessage = res.body.message;
        expect(actualMessage).to.be.equal('User deleted !');
        done();
      });
  });

  it('should verify that we have 0 user in the DB', (done) => {
    chai.request(server)
      .get('/api/user')
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.user.length).to.be.eql(0);
        done();
      });
  });
})
