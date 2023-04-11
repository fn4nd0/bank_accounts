// external modules
// const chalk = require('chalk')
// const inquirer = require('inquirer')
import chalk from 'chalk';
import inquirer from 'inquirer'


// internal modules
const fs = import('fs')

operation()

function operation() {

    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What do you wanna do?',
            choices: [
                'Create account',
                'Account balance',
                'Deposit',
                'Withdraw',
                'Exit'
            ],
        }
    ])
    .then((answer) => {

        const action = answer.action
        console.log(`You chose ${action}`)
    })
    .catch(err => console.error(err))

}