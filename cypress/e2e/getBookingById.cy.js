/// <reference types="cypress" />
import { fakerPT_BR as faker } from '@faker-js/faker';

describe('Funcionalidade de consultar a reserva com o ID', () => {

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
    it('Verificar que dados da reserva estão corretos após consulta por ID', () => {
        //criação da reserva
        cy.createBooking(reserva).then((response) => {
            const bookingId = response.body.bookingid


            //consulta e valida reserva
            cy.getBookingById(bookingId).then((response) => {
                expect(response.status).to.eq(200)

                expect(response.body).to.have.property('firstname', reserva.firstname)
                expect(response.body.lastname).to.eq(reserva.lastname)
                expect(response.body).to.have.property('totalprice', reserva.totalprice)
                expect(response.body).to.have.property('depositpaid', reserva.depositpaid)
                expect(response.body.bookingdates).to.have.property('checkin', reserva.bookingdates.checkin)
                expect(response.body.bookingdates).to.have.property('checkout', reserva.bookingdates.checkout)
                expect(response.body).to.have.property('additionalneeds', reserva.additionalneeds)
            })
        })
    })

    it('Verificar erro 404 ao consultar por ID inexistente', () => {
        const bookingId = 789654
        cy.getBookingById(bookingId).then((response) => {
            expect(response.status).to.eq(404)
            expect(response.body).contains('Not Found')
        })
    })
})