/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', () => {
    const THREE_SECONDS_IN_MS = 3000

    beforeEach(() => {
        cy.visit('./src/index.html')
    })


    it('verifica o título da aplicação', () => {
        cy.title().should('be.eq', 'Central de Atendimento ao Cliente TAT')
    })

    it('preenche os campos obrigatórios e envia o formulário', () => {
        const longText = 'Teste teste Teste teste Teste teste Teste teste Teste teste Teste teste Teste teste'

        cy.clock()

        cy.get('#firstName').type('Lucas')
        cy.get('#lastName').type('Wagenska')
        cy.get('#email').type('teste@teste.com')
        cy.get('#open-text-area').type(longText, { delay: 0 })
        cy.get('button[type=submit]').click()

        cy.get('.success')
            .should('be.visible')

        cy.tick(THREE_SECONDS_IN_MS)

        cy.get('.success')
            .should('not.be.visible')
    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
        cy.clock()

        cy.get('#firstName').type('Lucas')
        cy.get('#lastName').type('Wagenska')
        cy.get('#email').type('teste@testecom')
        cy.get('#open-text-area').type('teste')
        cy.get('button[type=submit]').click()

        cy.get('.error')
            .should('be.visible')

        cy.tick(THREE_SECONDS_IN_MS)

        cy.get('.error')
            .should('not.be.visible')

    })

    it('inserir valor não-númerico no campo telefone', () => {
        cy.get('#firstName').type('Lucas')
        cy.get('#lastName').type('Wagenska')
        cy.get('#email').type('teste@teste.com')
        cy.get('#phone-checkbox').click()
        cy.get('#phone')
            .type('oioioioi')
            .should('be.empty')
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
        cy.clock()

        cy.get('#firstName').type('Lucas')
        cy.get('#lastName').type('Wagenska')
        cy.get('#email').type('teste@teste.com')
        cy.get('#phone-checkbox')
            .check()
            .should('be.checked')
        cy.get('#open-text-area').type('teste')
        cy.get('button[type=submit]').click()

        cy.get('.error')
            .should('be.visible')

        cy.tick(THREE_SECONDS_IN_MS)

        cy.get('.error')
            .should('not.be.visible')
    })

    it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
        cy.get('#firstName')
            .type('Lucas')
            .should('have.value', 'Lucas')
            .clear()
            .should('be.empty')
        cy.get('#lastName')
            .type('Wagenska')
            .should('have.value', 'Wagenska')
            .clear()
            .should('be.empty')
        cy.get('#email')
            .type('teste@teste.com')
            .should('have.value', 'teste@teste.com')
            .clear()
            .should('be.empty')
        cy.get('#phone-checkbox').click()
        cy.get('#phone')
            .type('998989898')
            .should('have.value', '998989898')
            .clear()
            .should('be.empty')
        cy.get('#open-text-area')
            .type('teste')
            .should('have.value', 'teste')
            .clear()
            .should('be.empty')
    })

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
        cy.clock()

        cy.get('button[type=submit]').click()

        cy.get('.error')
            .should('be.visible')

        cy.tick(THREE_SECONDS_IN_MS)

        cy.get('.error')
            .should('not.be.visible')
    })

    Cypress._.times(5, () => {
        it('envia o formuário com sucesso usando um comando customizado', () => {
            cy.clock()

            cy.fillMandatoryFieldsAndSubmit()

            cy.get('.success')
                .should('be.visible')

            cy.tick(THREE_SECONDS_IN_MS)

            cy.get('.success')
                .should('not.be.visible')
        })
    })

    it('uso de contains', () => {
        cy.clock()

        cy.get('#firstName')
            .type('Lucas')
        cy.get('#lastName')
            .type('Wagenska')
        cy.get('#email')
            .type('teste@teste.com')
        cy.contains('label', 'Telefone').click()
        cy.get('#phone')
            .type('998989898')
        cy.get('#open-text-area').type('teste')
        cy.contains('button', 'Enviar').click()

        cy.get('.success')
            .should('be.visible')

        cy.tick(THREE_SECONDS_IN_MS)

        cy.get('.success')
            .should('not.be.visible')
    })

    it('seleciona um produto (YouTube) por seu texto', () => {
        cy.get('#product')
            .select('YouTube')
            .should('have.value', 'youtube')
    })

    it('seleciona um produto (Mentoria) por seu valor (value)', () => {
        cy.get('#product')
            .select('mentoria')
            .should('have.value', 'mentoria')
    })

    it('seleciona um produto (Blog) por seu índice', () => {
        cy.get('#product')
            .select(1)
            .should('have.value', 'blog')
    })

    it('marca o tipo de atendimento "Feedback"', () => {
        cy.get('input[value=feedback')
            .check()
            .should('be.checked')
    })

    it('marca cada tipo de atendimento', () => {
        cy.get('input[type=radio]')
            .should('have.length', 3).each($radio => {
                cy.wrap($radio)
                    .check()
                    .should('be.checked')
            })
    })

    it('marca ambos checkboxes, depois desmarca o último', () => {
        cy.get('#check input[type=checkbox]')
            .check()
            .should('be.checked')
            .last()
            .uncheck()
            .should('not.be.checked')
    })

    it('seleciona um arquivo da pasta fixtures', () => {
        cy.get('#file-upload')
            .should('not.have.value')
            .selectFile('cypress/fixtures/example.json')
            .then($input => {
                expect($input[0].files[0].name).to.be.eq('example.json')
            })
    })

    it('seleciona um arquivo simulando um drag-and-drop', () => {
        cy.get('#file-upload')
            .should('not.have.value')
            .selectFile('cypress/fixtures/example.json', { action: 'drag-drop' })
            .then(input => {
                expect(input[0].files[0].name).to.be.eq('example.json')
            })
    })

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
        cy.fixture('example.json')
            .as('exampleFile')
        cy.get('#file-upload')
            .selectFile('@exampleFile')
            .then(input => {
                expect(input[0].files[0].name).to.be.eq('example.json')
            })
    })

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
        cy.get('#privacy a').should('have.attr', 'target', '_blank')
    })

    it('acessa a página da política de privacidade removendo o target e então clicando no link', () => {
        cy.get('#privacy a')
            .invoke('removeAttr', 'target')
            .click()
    })

    it('testa a página da política de privacidade de forma independente', () => {
        cy.get('#privacy a').invoke('removeAttr', 'target').click()
        cy.title()
            .should('be.eq', 'Central de Atendimento ao Cliente TAT - Política de privacidade')
        cy.get('#title')
            .should('have.text', 'CAC TAT - Política de privacidade')
        cy.contains('Talking About Testing')
            .should('be.visible')
    })

    it('exibe mensagem por 3 segundos', function () {
        cy.clock() // congela o relógio do navegador

        // (...) // ação que dispara algo que exibe uma mensagem por três segundos
        cy.fillMandatoryFieldsAndSubmit()

        // (...) // verificação de que a mensagem está visível
        cy.get('.success')
            .should('be.visible')

        cy.tick(3000) // avança o relógio três segundos (em milissegundos). Avanço este tempo para não perdê-lo esperando.

        // (...) // verificação de que a mensagem não está mais visível
        cy.get('.success')
            .should('not.be.visible')
    })

    it('exibe e esconde as mensagens de sucesso e erro usando o .invoke()', () => {
        cy.get('.success')
            .should('not.be.visible')
            .invoke('show')
            .should('be.visible')
            .and('contain', 'Mensagem enviada com sucesso.')
            .invoke('hide')
            .should('not.be.visible')
        cy.get('.error')
            .should('not.be.visible')
            .invoke('show')
            .should('be.visible')
            .and('contain', 'Valide os campos obrigatórios!')
            .invoke('hide')
            .should('not.be.visible')
    })

    it('preenche a area de texto usando o comando invoke', () => {
        const longText = Cypress._.repeat('0123456789', 20)

        cy.get('#open-text-area')
            .invoke('val', longText)
            .should('have.value', longText)
    })

    it('faz uma requisição HTTP', () => {
        cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
            .should(response => {
                const { status, statusText, body } = response
                expect(status).to.eq(200)
                expect(statusText).to.eq('OK')
                expect(body).to.include('CAC TAT')
            })
    })

    it('econtrando o gato e demonstrando que está visível', () => {
        cy.get('#cat')
            .should('not.be.visible')
            .invoke('show')
            .should('be.visible')
        cy.get('#title')
            .invoke('text', 'CAT TAT')
        cy.get('#subtitle')
            .invoke('text', 'eu ❤️ gatos')
    })
})