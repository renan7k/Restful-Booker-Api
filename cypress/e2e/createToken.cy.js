/// <reference types="cypress" />
describe('Funcionalidade de criar token de acesso - API', () => {
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

        //Armazenando token gerado. Pendente de como enviar para uma variável no cypress env, para utilizar em outros testes
        const token = response.body.token
        cy.log(token)
        Cypress.env('ACCESS_TOKEN', token)
      })
  })

  it('Verificar mensagem de retorno ao tentar criar token com username inválido', () => {
    const credentials = {
      "username" : "teste12",
      "password" : "password123"
    }

    cy.postCreateToken(credentials).then((response) => {
      // Ponto de melhoria - Rota retorna 200, mas talvez o melhor seria 401 - Unauthorized
      // expect(response.status).to.eq(200) 
      expect(response.body).to.have.property('reason')

      expect(response.body.reason).is.equal('Bad credentials')
    })

  })

  it('Verificar mensagem de retorno ao tentar criar token com senha inválida', () => {
    const credentials = {
      "username" : "admin",
      "password" : "senha123"
    }

    cy.postCreateToken(credentials).then((response) => {
      // Ponto de melhoria - Rota retorna 200, mas talvez o melhor seria 401 - Unauthorized
      // expect(response.status).to.eq(200) 
      expect(response.body).to.have.property('reason')

      expect(response.body.reason).is.equal('Bad credentials')
    })
  })

  it('Verificar mensagem de retorno ao tentar criar token sem preenchimento do username', () => {
    const credentials = {
      "username" : "",
      "password" : "senha123"
    }

    cy.postCreateToken(credentials).then((response) => {
      // Ponto de melhoria - Rota retorna 200, mas talvez o melhor seria 401 - Unauthorized
      // expect(response.status).to.eq(200) 
      expect(response.body).to.have.property('reason')

      expect(response.body.reason).is.equal('Bad credentials')
    })
  })

  it.only('Verificar mensagem de retorno ao tentar criar token sem preenchimento do password', () => {
    const credentials = {
      "username" : "admin",
      "password" : ""
    }

    cy.postCreateToken(credentials).then((response) => {
      // Ponto de melhoria - Rota retorna 200, mas talvez o melhor seria 401 - Unauthorized
      // expect(response.status).to.eq(200) 
      expect(response.body).to.have.property('reason')

      expect(response.body.reason).is.equal('Bad credentials')
    })
  })
})