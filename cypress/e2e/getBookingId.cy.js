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
        var reserva = {
            "firstname": "Timoteo",
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
                cy.api({
                    method: 'GET',
                    url: `${Cypress.config('baseUrl')}/booking?firstname=${reserva.firstname}`
                }).then((response) => {
                    expect(response.status).to.eq(200)
                    //expect(response.body[0].bookingid).to.eq(bookingId) //Retornando mais de 1, o teste iria falhar
                    const ids = response.body.map(item => item.bookingid)//Extraindo todos os ID's da resposta
                    expect(ids).to.include(bookingId) //Verifica se o bookingid salvo está no array de id's retornados
                })
            })
        })

        it('Verificar response vazio ao consultar ID com um firstName não cadastrado', () => {
            const name = 'Troglosio'

            cy.api({
                method: 'GET',
                url: `${Cypress.config('baseUrl')}/booking?firstname=${name}`
            }).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).have.length(0)
            })
        })
    })

    context('Busca do ID pelo lastName', () => {
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

                cy.api({
                    method: 'GET',
                    url: `${Cypress.config('baseUrl')}/booking?lastname=${reserva.lastname}`
                }).then((response) => {
                    expect(response.status).to.eq(200)
                    const ids = response.body.map(item => item.bookingid)//Extraindo todos os ID's da resposta
                    expect(ids).to.include(bookingId) //Verifica se o bookingid salvo está no array de id's retornados
                })
            })
        })

        it('Verificar response vazio ao consultar ID com um lastName não cadastrado', () => {
            const lastName = 'Bubakhar'

            cy.api({
                method: 'GET',
                url: `${Cypress.config('baseUrl')}/booking?lastname=${lastName}`
            }).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).have.length(0)
            })
        })
    })

    context('Busca do ID pela data de checkin', () => {
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
        it.only('Verificar resposta com ID cadastrado ao consultar com o filtro da data de checkin', () => {

        })

    })

    context('Busca do ID pela data de checkout', () => {
        it('Verifi', () => {

        })

    })
})