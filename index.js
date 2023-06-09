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
        
        if (action === 'Create Account') {
            createAccount()
        } else if (action === 'Account balance') {
            getAccountBalance()
        } else if (action === 'Deposit') {
            deposit()
        } else if (action === 'Withdraw') {
            withdraw()
        } else if (action === 'Exit') {
            console.log(chalk.bgBlue.black('Thank you for use the Accounts!'))
            process.exit()
        }

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

// add on amount to the user account
function deposit() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: "What's your account name?"
        }
    ])
    .then((answer) => {

        const accountName = answer.accountName

        //verify if the account exists
        if (!checkAccount(accountName)) {
            return deposit()
        }

        inquirer.prompt([
            {
                name: 'amount',
                message: 'How much do you want to deposit?'
            }
        ]).then((answer) => {

            const amount = answer.amount

            // add an amount
            addAmount(accountName, amount)

            operation()
        }).catch((error) => console.log(error))

    })
    .catch((err) => {
        console.log(err)
    })
}

function checkAccount(accountName) {
    if (!fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(chalk.bgRed.black("This account " + accountName + " does not exist chose another name"))
        return false
    }
    return true
}

function addAmount(accountName, amount) {
    const account = getAccount(accountName)

    if(!amount) {
        console.log(chalk.bgRed.black("You didn't inform any ammount. Try again later."))
        return deposit()
    }

    account.balance = parseFloat(amount) + parseFloat(account.balance)

    fs.writeFileSync(
        `accounts/${accountName}.json`, 
        JSON.stringify(account)
        , function(err) {
            console.log(err)
        }
    )

    console.log(chalk.green(`$${amount} was deposited in your account!`))
}

function getAccount(accountName) {
    const accountJson = fs.readFileSync(`accounts/${accountName}.json`, { 
        encoding: 'utf8',
        flag: 'r'
    })

    return JSON.parse(accountJson)
}

function getAccountBalance() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: "What's your account name?"
        }
    ]).then((answer) => {
        const accountName = answer.accountName

        // verify if the account exists
        if (!checkAccount(accountName)) {
            return getAccountBalance()
        }

        const accountData = getAccount(accountName)

        console.log(chalk.bgBlue.black(
            `Your account balance is $${accountData.balance}`
        ))

        operation()
    }).catch((error) => console.log(error))
}

function withdraw() {
    inquirer.prompt([
        {
            name: "accountName",
            message: "What's your account name?"
        }
    ])
    .then((answer) => {
        const accountName = answer.accountName

        // verify if the account exists
        if(!checkAccount(accountName)) {
            return withdraw()
        }

        inquirer.prompt([
            {
                name: 'amount',
                message: 'How much to you want to withdraw?'
            }
        ])
        .then((answer) => {
            const amount = answer.amount

            removeAmount(accountName, amount)
        })
        .catch((error) => console.log(error))
    })
    .catch((error) => console.log(error))
}

function removeAmount(accountName, amount) {
    const accountData = getAccount(accountName)

    if (!amount) {
        console.log(chalk.bgRed.black("You did not inform the amount. Please try again"))
        return withdraw()
    }

    if (accountData.balance < amount) {
        console.log(chalk.bgRed.black("You don't have that amount to withdraw"))
        return withdraw()
    }

    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function(err) {
            console.log(err)
        }
    )

    console.log(
        chalk.green(`A withdraw of $${amount} was made in your account`)
    )

    operation()
}