const puppeteer = require('puppeteer')
const fs = require('fs')

module.exports = async (infoFromRequest) => {
    const htmlForPuppeteer = await fillHtmlTemplate(infoFromRequest)//Precisa que o style seja feito dentro do arquivo html
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const pageFormat = {
        width: infoFromRequest.format.width,
        height: infoFromRequest.format.height
    }
    await page.setViewport(pageFormat)
    await page.setContent('html')
    await page.goto('data:text/html,'+htmlForPuppeteer);
    const image = await page.screenshot({type: 'png'})
    const paramsForLink = await page.$$eval('.link', setParamsForLinks)
    await browser.close();
    return({
        params: paramsForLink,
        image: image,
        screenshotFormat: pageFormat
    })
}
async function fillHtmlTemplate(infoFromRequest){
    return new Promise(function(resolve,reject){
        try{
            fs.readFile('./cdv/cartaoDeVisitaTemplate.html', 'utf8', async function(err, data){
                if(err){return err}
                data = data.replace('headerLabelPlaceholder', infoFromRequest.header)
                data = data.replace('./dogpaw1.png', infoFromRequest.profilePic)
                data = data.replace('profileNamePlaceholder', infoFromRequest.name)
                data = data.replace('profileEmailPlaceholder', infoFromRequest.email)
                data = data.replace('profileContactPlaceholder', infoFromRequest.contact)
                fs.writeFile('./cdv/cartaoDeVisitaTemplate2.html',data, 'utf8', (err) => {if(err){return err}})
                resolve(data)
            })
        }catch(err){
            reject(err)
        }
    })
    /*fs.readFile('./cdv/cartaoDeVisitaTemplate.html', 'utf8', async function(err, data){
        if(err){return err}
        data = data.replace('headerLabelPlaceholder', infoFromRequest.header)
        data = data.replace('./dogpaw1.png', infoFromRequest.profilePic)
        data = data.replace('profileNamePlaceholder', infoFromRequest.name)
        data = data.replace('profileEmailPlaceholder', infoFromRequest.email)
        data = data.replace('profileContactPlaceholder', infoFromRequest.contact)
        fs.writeFile('./cdv/cartaoDeVisitaTemplate2.html',data, 'utf8', (err) => {if(err){return err}})
    })*/
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