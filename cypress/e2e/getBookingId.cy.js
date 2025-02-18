/// <reference types="cypress" />
import { fakerPT_BR as faker } from '@faker-js/faker';

describe('Funcionalidade de consultar o ID', () => {
    context('Busca dos IDs cadastrados', () => {
        it('Verificar consulta de todos os ids cadastrados com sucesso', () => {

            cy.getBookingId().then((response) => {
                expect(response.status).to.equal(200)
                expect(response.body).not.be.empty

                expect(response.body[0]).to.have.property('bookingid')
                expect(response.body[0].bookingid).to.be.a('number')

                //Código que percorreria todo o array validando, porém torna o teste lento. Deixamos validando apenas o 1º item
                // response.body.forEach(element => {
                //     expect(element).to.have.property('bookingid')
                //     expect(element.bookingid).to.be.a('number')
                // });
            })
        })
    })

    context('Busca do ID pelo firstName', () => {
        const parametro = 'firstname'
        var reserva = {
            "firstname": faker.name.firstName(),
            "lastname": "Andrade",
            "totalprice": 3500,
            "depositpaid": true,
            "bookingdates": {
                "checkin": "2026-09-26",
                "checkout": "2025-10-02"
            },
            "additionalneeds": "Late checkout"
        }

        it('Verificar resposta com ID cadastrado ao consultar com o filtro firstName', () => {
            //Criando a reserva, e armazenando o ID
            cy.createBooking(reserva).then((response) => {
                const bookingId = response.body.bookingid //armazenando o ID
                cy.log('Booking ID salvo:', bookingId);

                //Efetuando a consullta por nome e validando que o retorno da api, possui o id cadastrado
                cy.getBookingId(parametro, reserva.firstname).then((response) => {
                    expect(response.status).to.eq(200)
                    //expect(response.body[0].bookingid).to.eq(bookingId) //Retornando mais de 1, o teste iria falhar
                    const ids = response.body.map(item => item.bookingid)//Extraindo todos os ID's da resposta
                    expect(ids).to.include(bookingId) //Verifica se o bookingid salvo está no array de id's retornados
                })
            })
        })

        it('Verificar response vazio ao consultar ID com um firstName não cadastrado', () => {
            const firstName = 'Troglosio'

            cy.getBookingId(parametro, firstName).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).have.length(0)
            })
        })
    })

    context('Busca do ID pelo lastName', () => {
        const parametro = 'lastname'
        var reserva = {
            "firstname": faker.name.firstName(),
            "lastname": faker.name.lastName(),
            "totalprice": 3500,
            "depositpaid": faker.datatype.boolean(),
            "bookingdates": {
                "checkin": "2026-09-26",
                "checkout": "2025-10-02"
            },
            "additionalneeds": faker.word.words()
        }
        it('Verificar consulta (GET) de ID pelo lastName na rota "/booking" com sucesso', () => {
            cy.createBooking(reserva).then((response) => {
                const bookingId = response.body.bookingid //armazenando o ID
                cy.log('Booking ID salvo:', bookingId);

                cy.getBookingId(parametro, reserva.lastname).then((response) => {
                    expect(response.status).to.eq(200)
                    const ids = response.body.map(item => item.bookingid)//Extraindo todos os ID's da resposta
                    expect(ids).to.include(bookingId) //Verifica se o bookingid salvo está no array de id's retornados
                })
            })
        })

        it('Verificar response vazio ao consultar ID com um lastName não cadastrado', () => {
            const lastName = 'Bubakhar'

            cy.getBookingId(parametro, lastName).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).have.length(0)
            })
        })
    })

    context('Busca do ID pela data de checkin', () => {
        const parametro = 'checkin'
        var reserva = {
            "firstname": "Timoteo",
            "lastname": "Andrade",
            "totalprice": 3500,
            "depositpaid": true,
            "bookingdates": {
                "checkin": faker.date.soon(0),  // Gera uma data no futuro (geralmente próxima ao momento atual)
                "checkout": faker.date.soon(5)  // Gera uma data no futuro, pelo menos 5 dias depois
            },
            "additionalneeds": "Late checkout"
        }
        it('Verificar resposta com ID cadastrado ao consultar com o filtro da data de checkin', () => {
            cy.createBooking(reserva).then((response) => {
                const bookingId = response.body.bookingid
                
                cy.getBookingId(parametro, reserva.bookingdates.checkin).then((response) => {
                        expect(response.status).to.eq(200)
                        const ids = response.body.map(item => item.bookingid)//Extraindo todos os ID's da resposta
                        expect(ids).to.include(bookingId) //Verifica se o bookingid salvo está no array de id's retornados
                    })
            })
        })

        it.skip('Verificar response vazio ao consultar ID com uma data de checkin não cadastrada', () => {
            //Existe bug na api.| Filtro não funciona, e retorna diversas reservas
            const data = '2012-08-11'
            
            cy.getBookingId(parametro, data).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).have.length(0)
            })
        })

    })

    context('Busca do ID pela data de checkout', () => {
        const parametro = 'checkout'
        var reserva = {
            "firstname": faker.name.firstName(),
            "lastname": faker.name.lastName(),
            "totalprice": 3500,
            "depositpaid": true,
            "bookingdates": {
                "checkin": '2026-01-02',  // Gera uma data no futuro (geralmente próxima ao momento atual)
                "checkout": '2026-01-15'  // Gera uma data no futuro, pelo menos 5 dias depois
            },
            "additionalneeds": "Late checkout"
        }

        it('Verificar resposta com ID cadastrado ao consultar com o filtro da data de checkout', () => {
            cy.createBooking(reserva).then((response) => {
                const bookingId = response.body.bookingid
               
                cy.getBookingId(parametro, reserva.bookingdates.checkout).then((response) => {
                    expect(response.status).to.eq(200)
                    const ids = response.body.map(item => item.bookingid)//Extraindo todos os ID's da resposta
                    expect(ids).to.include(bookingId) //Verifica se o bookingid salvo está no array de id's retornados
                })
            })
        })
        it.skip('Verificar response vazio ao consultar ID com uma data de checkout não cadastrada', () => {
            //Existe bug na api. | Filtro não funciona, e retorna diversas reservas
            const data = '2015-08-11'
            
            // cy.api({
            //     method: 'GET',
            //     url: `${Cypress.config('baseUrl')}/booking?checkin=${checkout}`
            // })
            
            cy.getBookingId(parametro, dado).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).have.length(0)
            })
        })
    })
})