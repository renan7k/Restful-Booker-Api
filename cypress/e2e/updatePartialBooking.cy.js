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

    })

    it('Verificar alteração parcial de reserva com sucesso usando autenticação com token', () => {
        
    })

    it('Verificar erro 403 ao tentar alterar parcialmente a reserva sem envio de autenticação', () => {
        
    })

    it('Verificar erro ao enviar parâmetro com formato inválido', () => {
        
    })
})