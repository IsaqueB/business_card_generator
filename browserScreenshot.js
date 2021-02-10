const puppeteer = require('puppeteer')
const fs = require('fs')

module.exports = async (infoFromRequest) => {
    fillTemplate(infoFromRequest)
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const pageFormat = {
        width: infoFromRequest.format.width,
        height: infoFromRequest.format.height
    }
    await page.setViewport(pageFormat)
    await page.goto('file:///home/951548599/works/poc-jspdf/cdv/cartaoDeVisitaTemplate2.html');
    await page.screenshot({path: './example.png'})
    const paramsForLink = await page.$$eval('.link', setParamsForLinks)
    await browser.close();
    return({
        params: paramsForLink,
        path: "./example.png",
        screenshotFormat: pageFormat
    })
}
function fillTemplate(infoFromRequest){
    fs.readFile('./cdv/cartaoDeVisitaTemplate.html', 'utf8', async function(err, data){
        if(err){return err}
        data = data.replace('headerLabelPlaceholder', infoFromRequest.header)
        data = data.replace('./dogpaw1.png', infoFromRequest.profilePic)
        data = data.replace('profileNamePlaceholder', infoFromRequest.name)
        data = data.replace('profileEmailPlaceholder', infoFromRequest.email)
        data = data.replace('profileContactPlaceholder', infoFromRequest.contact)
        fs.writeFile('./cdv/cartaoDeVisitaTemplate2.html',data, 'utf8', (err) => {if(err){return err}
        })
    })
}
function setParamsForLinks(aTags){
    let links = ["http://br.linkedin.com","http://www.unifor.br","http://www.gmail.com"]
    let paramsForLinkObject = []
    for(let index = 0; index < aTags.length; index++){
        paramsForLinkObject.push({
            left: aTags[index].offsetLeft, 
            top:aTags[index].offsetTop, 
            width:aTags[index].offsetWidth, 
            height:aTags[index].offsetHeight,
            url: links[index]
        })
    }
    return paramsForLinkObject
}