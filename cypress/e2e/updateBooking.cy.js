/// <reference types="cypress" />
import { fakerPT_BR as faker } from '@faker-js/faker';

describe('Testes referente a funcionalidade de alteração de reservas via API', () => {
    var reserva = {
        "firstname": faker.name.firstName(),
        "lastname": faker.name.lastName(),
        "totalprice": 2800,
        "depositpaid": faker.datatype.boolean(),
        "bookingdates": {
            "checkin": "2026-09-26",
            "checkout": "2025-10-02"
        },
        "additionalneeds": faker.word.words()
    }
    it('Verificar alteração de reserva com sucesso usando autenticação com Authorization', () => {
        const Authorization = Cypress.env('Authorization');

        var reservaUpdate = {
            "firstname": 'Joelison',
            "lastname": 'Tadeu',
            "totalprice": 1290,
            "depositpaid": false,
            "bookingdates": {
                "checkin": "2025-10-01",
                "checkout": "2025-10-14"
            },
            "additionalneeds": 'Breakfast'
        }
        //criação da reserva
        cy.createBooking(reserva).then((response) => {
            const bookingId = response.body.bookingid

            //alteração da reserva e validação do response
            cy.updateBooking(bookingId, Authorization, reservaUpdate).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.firstname).to.equal(reservaUpdate.firstname)
                expect(response.body.lastname).to.equal(reservaUpdate.lastname)
                expect(response.body.totalprice).to.equal(reservaUpdate.totalprice)
                expect(response.body.depositpaid).to.equal(reservaUpdate.depositpaid)
                expect(response.body.bookingdates.checkin).to.equal(reservaUpdate.bookingdates.checkin)
                expect(response.body.bookingdates.checkout).to.equal(reservaUpdate.bookingdates.checkout)
                expect(response.body.additionalneeds).to.equal(reservaUpdate.additionalneeds)
            })
            //consulta da reserva atualizada na rota de busca

            cy.getBookingById(bookingId).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.firstname).to.equal(reservaUpdate.firstname)
                expect(response.body.lastname).to.equal(reservaUpdate.lastname)
                expect(response.body.totalprice).to.equal(reservaUpdate.totalprice)
                expect(response.body.depositpaid).to.equal(reservaUpdate.depositpaid)
                expect(response.body.bookingdates.checkin).to.equal(reservaUpdate.bookingdates.checkin)
                expect(response.body.bookingdates.checkout).to.equal(reservaUpdate.bookingdates.checkout)
                expect(response.body.additionalneeds).to.equal(reservaUpdate.additionalneeds)
            })

        })



    })

    //Mesmo cenário de cima, alterando a forma de autenticação
    it.only('Verificar alteração de reserva com sucesso usando autenticação com token', () => {
        const credentials = {
            "username": "admin",
            "password": "password123"
        }
        var reservaUpdate = {
            "firstname": 'Marta',
            "lastname": 'Guimaraes',
            "totalprice": 567,
            "depositpaid": true,
            "bookingdates": {
                "checkin": "2025-11-12",
                "checkout": "2025-11-20"
            },
            "additionalneeds": 'Parking'
        }
        cy.createToken(credentials);

        //Aqui estamos usando o alias definido no comando customizado de criação do token;
        //Foi a maneira mais rápida de reaproveitar o token 
        //Pendente de estudar uma possibilidade de usar o cypress.env, e o comando enviar o token atualizado para lá
        cy.get('@authToken').then((token) => {
            cy.createBooking(reserva).then((response) => {
                const bookingId = response.body.bookingid;

                cy.api({
                    method: 'PUT',
                    url: `${Cypress.config('baseUrl')}/booking/${bookingId}`, //Usando o id salvo
                    headers: {
                        Cookie: `token=${token}` //Usando o token salvo
                    },
                    body: reservaUpdate,
                }).then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body.firstname).to.equal(reservaUpdate.firstname)
                    expect(response.body.lastname).to.equal(reservaUpdate.lastname)
                    expect(response.body.totalprice).to.equal(reservaUpdate.totalprice)
                    expect(response.body.depositpaid).to.equal(reservaUpdate.depositpaid)
                    expect(response.body.bookingdates.checkin).to.equal(reservaUpdate.bookingdates.checkin)
                    expect(response.body.bookingdates.checkout).to.equal(reservaUpdate.bookingdates.checkout)
                    expect(response.body.additionalneeds).to.equal(reservaUpdate.additionalneeds)
                })
            })
        })
    })

    it('Verificar erro 403 ao tentar alterar reserva com authorization inválido', () => {
        
    })

    it('Verificar erro 403 ao tentar alterar reserva com token inválido', () => {

    })

})