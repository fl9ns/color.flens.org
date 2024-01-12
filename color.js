console.clear()

// Filesystem
const Fs = require('fs')

// Request
const Https = require('https')

// My Config
const CONFIG = {
    user: {
        name: 'FL9NS',
        id: '103070919',
    },
    token: {
        access: '<your_token_here>', // user:manage:chat_color
        client: '<client_id_of_token_generated>',
    },
}

// Output shell
console.log('+-----------------------------------------------+')
console.log('|                                               |')
console.log('|   Twitch -> Change Color -> FL9NS             |')
console.log('|                                               |')
console.log('| - - - - - - - - - - - - - - - - - - - - - - - |')
console.log('|                                               |')
console.log('|   Script:  twitch.change.color.fl9ns.js       |')
console.log('|   Version: 1.1                                |')
console.log('|                                               |')
console.log('+-----------------------------------------------+')

// Save PID
Fs.writeFileSync(`/tmp/twitch.change.color.fl9ns.pid`, `${process.pid}`)

// My tools
const tool = {
    random: (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min
    },
    color: (hexa) => {
        if(hexa === true) {
            const colorChar = [`0`,`1`,`2`,`3`,`4`,`5`,`6`,`7`,`8`,`9`,`A`,`B`,`C`,`D`,`E`,`F`]
            let result = ``
            for(let i=1; i<=6; i++) {
                result += colorChar[tool.random(0, colorChar.length-1)]
            }
            return `%23${result}`
        } else {
            const colorName = ['blue',
                                'blue_violet',
                                'cadet_blue',
                                'chocolate',
                                'coral',
                                'dodger_blue',
                                'firebrick',
                                'golden_rod',
                                'green',
                                'hot_pink',
                                'orange_red',
                                'red',
                                'sea_green',
                                'spring_green',
                                'yellow_green']
            return colorName[tool.random(0, colorName.length-1)]
        }
    },
    change: {
        color: (color) => {
            return new Promise((resolve) => {
                const req = Https.request({
                    hostname: 'api.twitch.tv',
                    path: `helix/chat/color?user_id=${CONFIG.user.id}&color=${color}`,
                    method: `PUT`,
                    headers: {
                        'Authorization':`Bearer ${CONFIG.token.access}`,
                        'Client-Id':`${CONFIG.token.client}`,
                        'Content-Type': 'application/json'
                    }
                }, (res) => {
                    resolve(res.statusCode) // 204: Successfully updated the user’s chat color.
                })
                req.on('error', (e) => { resolve(0) })
                req.end()
            })
        }
    },
}

// Main loop
setInterval(async () => {
    const color = tool.color()
    const status = await tool.change.color(color)
    if(status !== 204) {
        process.stdout.write(`ERROR ${status}`+"         \r");
    } else {
        process.stdout.write(`${color}`+"         \r");
    }
}, 500)
