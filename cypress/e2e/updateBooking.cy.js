/// <reference types="cypress" />
import { fakerPT_BR as faker } from '@faker-js/faker';

describe ('Testes referente a funcionalidade de alteração de reservas via API', () => {
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
    it.only('Verificar alteração de reserva com sucesso usando autenticação com Authorization', () => {
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

        cy.createBooking(reserva).then((response) => {
            const bookingId = response.body.bookingid

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
        })
        //criação da reserva
        //alteração da reserva
        //consulta da reserva atualizada
    })

    it('Verificar alteração de reserva com sucesso usando autenticação com Authorization', () => {
        
    })

    it('', () => {
        
    })

})