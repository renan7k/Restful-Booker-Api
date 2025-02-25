/// <reference types="cypress" />
import { fakerPT_BR as faker } from '@faker-js/faker';

describe('Testes referente a funcionalidade de exclusão de reservas via API', () => {
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

    it('Verificar exclusão de reserva com sucesso usando autenticação com Authorization', () => {
        //criação da reserva
        //exclusão da reserva
        
        cy.createBooking(reserva).then((response) => {
            const bookingId = response.body.bookingid;

           cy.deleteBooking(bookingId).then((response) => {
                expect(response.status).to.eq(201)
            })
        //Validar que reserva não existe mais
            cy.getBookingById(bookingId).then((response) => {
                expect(response.status).to.eq(404)
                expect(response.body).contains('Not Found')
            })
        })
        
    })

    it.only('com token', () => {

        //finalizar teste , e descrever etapas , (uso do alias, etc)
        const credentials = {
            "username" : "admin",
            "password" : "password123"
          }
      
        cy.createToken(credentials);
        
        cy.get('@authToken').then((token) => {
            cy.createBooking(reserva).then((response) => {
                const bookingId = response.body.bookingid;
    
                cy.api({
                    method: 'DELETE',
                    url: `${Cypress.config('baseUrl')}/booking/${bookingId}`,
                    headers: {
                        Cookie: `token=${token}`
                    }
                }).then((response) => {
                    expect(response.status).to.eq(201)
                })
            //Validar que reserva não existe mais
                // cy.getBookingById(bookingId).then((response) => {
                //     expect(response.status).to.eq(404)
                //     expect(response.body).contains('Not Found')
                // })
            })

        })
    })
})