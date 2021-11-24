/// <reference types="cypress" />

describe('Unit Tests', () => {
    beforeEach(() => {
        cy.visit('https://predict-webapp.herokuapp.com/')
    })

    it('Home page', () => {
        cy.get(':nth-child(2) > .MuiBox-root > .MuiTypography-root').should('have.text', 'Predict')
    })

    it('Login Test', () => {
        // cy.login_user1()
    })

    it('Show My Profile', () => {
        cy.get('.MuiTypography-root > .MuiButtonBase-root').click()
        cy.get(':nth-child(1) > .MuiButtonBase-root > .MuiIconButton-label > .MuiSvgIcon-root').click()
        cy.get('[href="/profile/608673909e6fed3064ad01c9"]').click()
    })

    it('Show Friends', () => {
        cy.get('.MuiTypography-root > .MuiButtonBase-root').click()
        cy.get(':nth-child(1) > .MuiButtonBase-root > .MuiIconButton-label > .MuiSvgIcon-root').click()
        cy.get('[href="/friends/0"]').click()
    })

    it('Show Rewards', () => {
        cy.get('.MuiTypography-root > .MuiButtonBase-root').click()
        cy.get(':nth-child(1) > .MuiButtonBase-root > .MuiIconButton-label > .MuiSvgIcon-root').click()
        cy.get('[href="/rewards"]').click()
    })

    it('Show My Battles', () => {
        cy.get('.MuiTypography-root > .MuiButtonBase-root').click()
        cy.get(':nth-child(1) > .MuiButtonBase-root > .MuiIconButton-label > .MuiSvgIcon-root').click()
        cy.get('[href="/bets/0"]').click()
    })

    it('Create a Battle', () => {
        cy.get('.MuiTypography-root > .MuiButtonBase-root').click()
        cy.get(':nth-child(1) > .MuiPaper-root > .MuiCardActions-root > [title="Create Prediction Battle"]').click()
        cy.get(':nth-child(1) > .MuiFormControlLabel-root > .MuiButtonBase-root > .MuiIconButton-label > .jss18').click()
        cy.get('#outlined-size-normal').click().type('10')
        cy.get('.MuiCardContent-root > .MuiBox-root > .MuiButtonBase-root').click()
    })
})

