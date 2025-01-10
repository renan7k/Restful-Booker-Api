/// <reference types="cypress" />

describe('Funcionalidade de consultar o ID', () => {
    context('Busca dos IDs cadastrados', () => {
        it('Verificar consulta de todos os ids cadastrados com sucesso', () => {

            cy.getBookingId().then((response) => {
                expect(response.status).to.equal(200)
                expect(response.body).not.be.empty
                
                expect(response.body[0]).to.have.property('bookingid')
                expect(response.body[0].bookingid).to.be.a('number')

                //Código que percorreria todo o array validando, porém torna o teste lento
                // response.body.forEach(element => {
                //     expect(element).to.have.property('bookingid')
                //     expect(element.bookingid).to.be.a('number')
                // });
            })
        })
    })
    
    context('Busca do ID pelo firstName', () => {
        it('Verificar consulta de ID pelo firstName com sucesso', () => {
            //criar reserva
            //armazenar nome
            //buscar nome
        })
        
        it('Verificar consulta de ID com um firstName não cadastrado', () => {

        })
    })

    context('Busca do ID pelo lastName', () => {
        it('Verifi', () => {

        })
        
    })

    context('Busca do ID pela data de checkin', () => {
        it('Verifi', () => {

        })
        
    })

    context('Busca do ID pela data de checkout', () => {
        it('Verifi', () => {

        })
        
    })
})