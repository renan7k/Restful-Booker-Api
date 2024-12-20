Cypress.Commands.add('postCreateToken', (credentials) => {
    cy.request({
        method: 'POST',
        url: 'https://restful-booker.herokuapp.com/auth',
        body: { 
            "username" : credentials.username,
            "password" : credentials.password },
        headers: {
            'Content-Type': 'application/json' // Tipo de conteúdo do body
        }
        // .then((response) => {
        //     Cypress.env('ACCESS_TOKEN', response.body.token)
        // })

        //PENDENTE COMO ENVIAR O TOKEN PARA O CYPRESS.ENV
    })
})