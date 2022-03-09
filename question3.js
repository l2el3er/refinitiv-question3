
const https = require('https');

const getFundList = () => {
    return new Promise((resolve) => {
        const options = {
            hostname: 'codequiz.azurewebsites.net',
            path: '/',
            headers: {
                Cookie: 'hasCookie=true'
            }
        }
        https.get(options, (resp) => {
            let data = '';
            resp.on('data', (chunk) => {
                data += chunk;
            });
            resp.on('end', () => {
                resolve(data);
            });
        })
    })
}
const parseNavList = (fundlist) => {
    let parse = fundlist.match(/<tr>(.*?)<\/tr>/gm)
    parse = parse.slice(1, parse.length).map(txt => txt.match(/(?<=<td>)(.*?)(?=<\/td>)/g))
    const parseNav = parse.map(fund => ({
        name: fund[0].trim(),
        nav: fund[1]
    }))

    return parseNav
}

const main = async () => {
    const fundList = await getFundList()
    const navList = parseNavList(fundList)
    const fundParams = process.argv[process.argv.length - 1]
    const answer = navList.filter(item => item.name === fundParams)[0]
    if (answer) {
        console.log(answer.nav);
    } else {
        console.log(`fund "${fundParams}" not exist`);
    }
}

main()