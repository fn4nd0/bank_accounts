// external modules
import chalk from 'chalk';
import inquirer from 'inquirer'


// internal modules
import fs from 'fs'

operation()

function operation() {

    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What do you wanna do?',
            choices: [
                'Create Account',
                'Account balance',
                'Deposit',
                'Withdraw',
                'Exit'
            ],
        }
    ])
    .then((answer) => {

        const action = answer.action
        
        if (action === 'Create Account')
            createAccount()

    })
    .catch(err => console.error(err))
}

// Create Account
function createAccount() {
    console.log(chalk.bgGreen.black('Contratulations for chosing our bank!'))
    console.log(chalk.green(`Define your account settings next`))
    buildAccount()
}

function buildAccount() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Chose a name for your account:'
        },
    ])
    .then((answer) => {
        const accountName = answer.accountName
        console.info(accountName)

        if (!fs.existsSync('accounts'))
            fs.mkdirSync('accounts')
        
        if (fs.existsSync(`accounts/${accountName}.json`)) {
            console.log(chalk.bgRed.black('This account already exists, chose another name!'))
            buildAccount()
            return
        }
            
        fs.writeFileSync(`accounts/${accountName}.json`, '{"balance": 0}', function(err) {
            console.log(err)
        })

        operation()
        
    })
}