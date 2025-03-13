/// <reference types="cypress" />
import { fakerPT_BR as faker } from '@faker-js/faker';

describe('Testes referente a funcionalidade de alteração PARCIAL de reservas via API', () => {
    var reserva = {
        "firstname": faker.name.firstName(),
        "lastname": faker.name.lastName(),
        "totalprice": 2800,
        "depositpaid": faker.datatype.boolean(),
        "bookingdates": {
            "checkin": "2026-01-26",
            "checkout": "2026-01-20"
        },
        "additionalneeds": faker.word.words()
    }

    it('Verificar alteração parcial de reserva com sucesso usando autenticação com Authorization', () => {
        const Authorization = Cypress.env('Authorization')

        var reservaUpdate = {
            "firstname": 'Raimundo',
            "totalprice": 4321,
        }
        //Criação da reserva
        cy.createBooking(reserva).then((response) => {
            const bookingId = response.body.bookingid
            //Alteração da reserva
            cy.updatePartialBooking(bookingId, Authorization, reservaUpdate).then((response) => {
                //Validação do response com campos atualizados
                expect(response.status).to.eq(200)
                expect(response.body.firstname).to.equal(reservaUpdate.firstname)
                expect(response.body.lastname).to.equal(reserva.lastname)
                expect(response.body.totalprice).to.equal(reservaUpdate.totalprice)
                expect(response.body.depositpaid).to.equal(reserva.depositpaid)
                expect(response.body.bookingdates.checkin).to.equal(reserva.bookingdates.checkin)
                expect(response.body.bookingdates.checkout).to.equal(reserva.bookingdates.checkout)
                expect(response.body.additionalneeds).to.equal(reserva.additionalneeds)
            })
        })
    })

    it('Verificar alteração parcial de reserva com sucesso usando autenticação com token', () => {
        var reservaUpdate = {
            "bookingdates": {
                "checkin": "2025-11-12",
                "checkout": "2025-11-20"
            },
            "additionalneeds": 'Parking and breakfast'
        }

        cy.createToken(Cypress.env('credentials'));

        cy.get('@authToken').then((token) => {
            cy.createBooking(reserva).then((response) => {
                const bookingId = response.body.bookingid
                //Alteração da reserva

                cy.api({
                    method: 'PATCH',
                    url: `${Cypress.config('baseUrl')}/booking/${bookingId}`,
                    headers: {
                        Cookie: `token=${token}`
                    },
                    body: reservaUpdate
                }).then((response) => {
                    //Validação do response com campos atualizados
                    expect(response.status).to.eq(200)
                    expect(response.body.firstname).to.equal(reserva.firstname)
                    expect(response.body.lastname).to.equal(reserva.lastname)
                    expect(response.body.totalprice).to.equal(reserva.totalprice)
                    expect(response.body.depositpaid).to.equal(reserva.depositpaid)
                    expect(response.body.bookingdates.checkin).to.equal(reservaUpdate.bookingdates.checkin)
                    expect(response.body.bookingdates.checkout).to.equal(reservaUpdate.bookingdates.checkout)
                    expect(response.body.additionalneeds).to.equal(reservaUpdate.additionalneeds)
                })
            })
        })
    })

    it('Verificar erro 403 ao tentar alterar parcialmente a reserva sem envio de autenticação', () => {
        var reservaUpdate = {
            "firstname": 'Raimundo',
            "totalprice": 4321,
        }
        const bookingId = 9;
        cy.api({
            method: 'PATCH',
            url : `${Cypress.config('baseUrl')}/booking/${bookingId}`,
            body : reservaUpdate,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(403)
            expect(response.body).to.contain('Forbidden')
        })
    })

    it.skip('Verificar erro ao enviar parâmetro com formato inválido', () => {
        //Bug: A requisição aceita o formato errado e retorna 200
        //Talvez o mais adequado seria o 400 bad request
        const Authorization = Cypress.env('Authorization')

        var reservaUpdate = {
            "firstname": 12345,
            "totalprice": "Juarez",
        }

        cy.createBooking(reserva).then((response) => {
            const bookingId = response.body.bookingid
            //Alteração da reserva
            cy.updatePartialBooking(bookingId, Authorization, reservaUpdate).then((response) => {
                //Validação do response com campos atualizados
                expect(response.status).to.eq(400)
            })
        })

    })
})