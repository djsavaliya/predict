/// <reference types="cypress" />

describe('Integration Test', () => {

    it('Intergration Test1', () => {
        cy.visit('https://predict-webapp.herokuapp.com/')
        cy.get(':nth-child(2) > .MuiBox-root > .MuiTypography-root').should('have.text', 'Predict')

        cy.get('.MuiTypography-root > .MuiButtonBase-root').click()
        cy.get(':nth-child(1) > .MuiButtonBase-root > .MuiIconButton-label > .MuiSvgIcon-root').click()
        cy.get('[href="/profile/608673909e6fed3064ad01c9"]').click()

        cy.get(':nth-child(1) > .MuiButtonBase-root > .MuiIconButton-label > .MuiSvgIcon-root').click()
        cy.get('[href="/friends/0"]').click()

        cy.get(':nth-child(1) > .MuiButtonBase-root > .MuiIconButton-label > .MuiSvgIcon-root').click()
        cy.get('[href="/rewards"]').click()

        cy.get(':nth-child(1) > .MuiButtonBase-root > .MuiIconButton-label > .MuiSvgIcon-root').click()
        cy.get('.MuiList-root > [href="/"]').click()
        cy.get(':nth-child(1) > .MuiPaper-root > .MuiCardActions-root > [title="Create Prediction Battle"]').click()
        cy.get(':nth-child(1) > .MuiFormControlLabel-root > .MuiButtonBase-root > .MuiIconButton-label > .jss18').click()
        cy.get('#outlined-size-normal').click().type('10')
        cy.get('.MuiCardContent-root > .MuiBox-root > .MuiButtonBase-root').click()

        cy.get('.MuiToolbar-root > :nth-child(1) > .MuiButtonBase-root').click()
        cy.get('[href="/bets/0"]').click()
        cy.get('.MuiTabs-flexContainer > :nth-child(2)').click()
        cy.get('[aria-label="Withdraw Challenge"] > .MuiIconButton-label > .MuiSvgIcon-root > path').click({ multiple: true })

        cy.get('.MuiToolbar-root > :nth-child(1) > .MuiButtonBase-root').click()
        cy.get('.MuiList-root > [href="/"]').click()
    })

    it('Intergration Test2', () => {
        cy.visit('https://predict-webapp.herokuapp.com/')
        cy.get(':nth-child(2) > .MuiBox-root > .MuiTypography-root').should('have.text', 'Predict')

        cy.get('.MuiTypography-root > .MuiButtonBase-root').click()
        cy.get(':nth-child(1) > .MuiButtonBase-root > .MuiIconButton-label > .MuiSvgIcon-root').click()
        cy.get('[href="/profile/608673909e6fed3064ad01c9"]').click()

        cy.get(':nth-child(1) > .MuiButtonBase-root > .MuiIconButton-label > .MuiSvgIcon-root').click()
        cy.get('[href="/friends/0"]').click()

        cy.get('.MuiToolbar-root > .MuiBox-root > .search > .MuiInputBase-root > .MuiInputBase-input').click()
            .type('Darshil{enter}')
        cy.get(':nth-child(2) > .MuiButtonBase-root').click()
        cy.get(':nth-child(2) > .MuiButtonBase-root').click()
        // cy.get('.MuiToolbar-root > :nth-child(1) > .MuiButtonBase-root').click()
        // cy.get('.MuiList-root > [href="/"]').click()
    })
})
