Cypress.Commands.add('postCreateToken', (credentials) => {
    cy.api({
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

//Este segundo comando customizado, é específico para os testes de outras rotas que necessitam de autenticação
Cypress.Commands.add('createToken', (credentials) => {
    cy.api({
        method: 'POST',
        url: 'https://restful-booker.herokuapp.com/auth',
        body: { 
            "username": credentials.username,
            "password": credentials.password
        },
        headers: {'Content-Type': 'application/json'}
    }).then((response) => {
        // Armazena o token no Cypress
        const token = response.body.token;
        
        // Salva o token em um alias para usar em outros testes
        cy.wrap(token).as('authToken');
    });
});

Cypress.Commands.add('createBooking', (dadosReserva) => {
    cy.api({
        method: 'POST',
        url: `${Cypress.config('baseUrl')}/booking`,
        body: dadosReserva,
        failOnStatusCode: false  //Não falha automaticamente se o status for 500
    })
})

Cypress.Commands.add('getBookingId', (parametro, dado) => {
    cy.api({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/booking?${parametro}=${dado}`
             //`${Cypress.config('baseUrl')}/booking?checkin=${checkin}`
    })
})

Cypress.Commands.add('getBookingById', (bookingId) => {
    cy.api({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/booking/${bookingId}`,
        failOnStatusCode: false 
    })
})