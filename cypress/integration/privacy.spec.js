it.only('testa a página da política de privacidade de forma independente', () => {
    cy.visit('./src/privacy.html')
    cy.title()
        .should('be.eq', 'Central de Atendimento ao Cliente TAT - Política de privacidade')
    cy.get('#title')
        .should('have.text', 'CAC TAT - Política de privacidade')
    cy.contains('Talking About Testing')
        .should('be.visible')
})