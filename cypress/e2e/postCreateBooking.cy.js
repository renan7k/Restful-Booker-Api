/// <reference types="cypress" />
import { fakerPT_BR as faker } from '@faker-js/faker';

describe('Testes da funcionalidade de criar reserva - API', () => {

    it('Verificar criação de reserva com sucesso', () => {
        const dadosReserva = {
            "firstname" : faker.name.firstName(),
            "lastname" : faker.name.lastName(),
            "totalprice" : Math.floor(faker.commerce.price(1000, 5000)), //Devido a bug nas casas decimais, gerando apenas valor inteiro
            "depositpaid" : faker.datatype.boolean(),
            "bookingdates" : {
                "checkin" : "2026-09-26",
                "checkout" : "2025-10-02"
            },
            "additionalneeds" : faker.word.words()
        }

        cy.createBooking(dadosReserva).then((response) => {
            expect(response.status).to.eq(200)

            //Validando que o campo existe, e que possui o conteúdo esperado
            expect(response.body).to.have.property('bookingid')
            expect(response.body.booking).to.have.property('firstname', dadosReserva.firstname)
            expect(response.body.booking).to.have.property('lastname', dadosReserva.lastname)
            expect(response.body.booking).to.have.property('totalprice', dadosReserva.totalprice)
            expect(response.body.booking).to.have.property('depositpaid', dadosReserva.depositpaid)
            expect(response.body.booking.bookingdates).to.have.property('checkin', dadosReserva.bookingdates.checkin)
            expect(response.body.booking.bookingdates).to.have.property('checkout', dadosReserva.bookingdates.checkout)
            expect(response.body.booking).to.have.property('additionalneeds', dadosReserva.additionalneeds)

        })
    })
})