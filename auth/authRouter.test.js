const server = require('../api/server.js')
const request = require('supertest')
const db = require('../data/dbConfig.js')
const Users = require('./authModel.js')

describe('auth router', function() {     


    // it('POST A NEW USER: should return status 201', () => {


    //     // *** please change the username before running ***
    //     return request(server).post('/api/auth/register')  
    //         .send({username:'abc1234567', password:'pass'})      
    //             .then((response) => {  
    //                 expect(response.status).toBe(201)
    //                 expect(response.body.newId.length).toEqual(1)
    //                 expect(response.body.message).toContain("Registered!")
    //                 Users.remove({username:'abc1234567'})
    //             })
    // }) 

    it('REGISTER + LOGIN: should return a json web token', () => {
        return request(server).post('/api/auth/register')
            .send({username:'pen123', password:'pass'})
                .then((response) => {
                    return request(server).post('/api/auth/login')
                    .send({username:'pen123', password:'pass'})
                        .then((response) => {
                            expect(response.body.token.length).toBeGreaterThan(25)
                            Users.remove({username:'pen123'})
                        })
                })

    })
})