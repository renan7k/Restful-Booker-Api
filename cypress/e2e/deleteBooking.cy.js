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
        const Authorization = Cypress.env('AUTHORIZATION_TOKEN');
        cy.createBooking(reserva).then((response) => {
            const bookingId = response.body.bookingid;

           cy.deleteBooking(bookingId, Authorization).then((response) => {
                expect(response.status).to.eq(201)
            })
        //Validar que reserva não existe mais
            cy.getBookingById(bookingId).then((response) => {
                expect(response.status).to.eq(404)
                expect(response.body).contains('Not Found')
            })
        })
        
    })

    it('Verificar exclusão de reserva com sucesso usando autenticação com token', () => {
        console.log("Valor de CREDENTIALS:", Cypress.env('CREDENTIALS'));
        const credentials = JSON.parse(Cypress.env('CREDENTIALS')); 
        
        //finalizar teste , e descrever etapas , (uso do alias, etc)

        cy.createToken(credentials);
        
        //Aqui estamos usando o alias definido no comando customizado de criação do token;
        //Foi a maneira mais rápida de reaproveitar o token 
        //Pendente de estudar uma possibilidade de usar o cypress.env, e o comando enviar o token atualizado para lá
        cy.get('@authToken').then((token) => {
            cy.createBooking(reserva).then((response) => { // Reaproveitando o token, criamos a reserva
                const bookingId = response.body.bookingid; //Salvando o id da reserva criada
    
                cy.api({
                    method: 'DELETE',
                    url: `${Cypress.config('baseUrl')}/booking/${bookingId}`, //Usando o id salvo
                    headers: {
                        Cookie: `token=${token}` //Usando o token salvo
                    }
                }).then((response) => {
                    expect(response.status).to.eq(201)
                })
            //Validar que reserva não existe mais
                cy.getBookingById(bookingId).then((response) => {
                    expect(response.status).to.eq(404)
                    expect(response.body).contains('Not Found')
                })
            })

        })
    })
    it('Verificar que api apresenta erro 403 ao tentar deletar a reserva enviando um authorization inválido', () => {
        const Authorization = "Basic KTXtaW46cGFzc2uvcmQxMjM="

        cy.createBooking(reserva).then((response) => {
            const bookingId = response.body.bookingid;

           cy.deleteBooking(bookingId, Authorization).then((response) => {
                expect(response.status).to.eq(403)
                expect(response.body).contains('Forbidden')
            })
        })

    })

    it('Verificar que api apresenta erro ao tentar deletar uma reserva com id inválido', () => {
        //Bug de melhoria, Api deveria retornar talvez um 404 - not found
        const Authorization = Cypress.env('AUTHORIZATION_TOKEN');
        const bookingId = 7832154;

        cy.deleteBooking(bookingId, Authorization).then((response) => {
            expect(response.status).to.eq(405)
            expect(response.body).contains('Method Not Allowed')
        })
    })
})