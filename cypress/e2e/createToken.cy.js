/// <reference types="cypress" />
describe('Funcionalidade de criar token de acesso - API', () => {

  beforeEach(() => {
  })
  it('Verificar criação de token com sucesso', () => {
    const credentials = {
      "username" : "admin",
      "password" : "password123"
    }

    cy.postCreateToken(credentials)
      .then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('token')

        expect(response.body.token).is.not.empty
        expect(response.body.token).is.not.null
        Cypress.env('ACCESS_TOKEN', response.body.token)
      })
  })
})