const jspdf = require('jspdf')
//const fs = require('fs')
const browserScreenshot = require('./browserScreenshot')

module.exports = {
    pdfGenerator: async function(req, res){
        /*let requestParams = {
            header: req.body.header,
            profilePic: req.body.profilePic,
            name: req.body.name,
            email: req.body.email,
            contact: req.body.contact
        }*/
        let screenshotParams = await browserScreenshot(/*requestParams*/req.body)
        const doc = new jspdf.jsPDF({
            orientation: 'portrait',
            hotfixes: ["px_scaling"],
            unit: 'px',
            format: [screenshotParams.screenshotFormat.width, screenshotParams.screenshotFormat.height]
        });
        let screenshot = screenshotParams.image
        doc.addImage(screenshot, 'JPEG', 0, 0, screenshotParams.screenshotFormat.width, screenshotParams.screenshotFormat.height, 'test', 'NONE', 0)
        addLinksToPdf(doc, screenshotParams.params)
        res.type('pdf')
        res.send(new Buffer.from(doc.output('arraybuffer'), 'base64'))
        //fs.writeFile('./here.pdf',new Int32Array(await doc.output('arraybuffer')), (err)=>{if(err){console.log(err)}})
        //res.send(new Int32Array(await doc.output('arraybuffer')))
        //await doc.save("a7.pdf")
        //res.status(200).download('./a7.pdf')
    }
}
function addLinksToPdf(instanceOfDoc, paramsForLinks){
        for(let i = 0; i < paramsForLinks.length; i++){
            instanceOfDoc.link(
                    paramsForLinks[i].left, 
                    paramsForLinks[i].top, 
                    paramsForLinks[i].width, 
                    paramsForLinks[i].height, 
                    {url: paramsForLinks[i].url})
        }
}