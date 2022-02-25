export function Partner395Customizations (ReportID, data) {
    if (ReportID === undefined) {
        ReportID = parseInt(1)
    }
    data.ReportID = parseInt(ReportID)
    if (data.PartnerID === 395) {     
        if (data.ReportID === 1) {
            data.reportName = 'Risk Control Skills Report'
            data.showskills = true           
        }
        if (data.ReportID === 2) {
            data.SMEOnly = true
            data.reportName = 'Risk Control SME Report'
            data.showskills = false 
        }
    }
    return data
}

export function Partner395Attributes(PartnerID, ReportID, attributename) {
    if (ReportID === undefined) {
        ReportID = parseInt(1)
    }
    if (PartnerID === 395) {
        if (ReportID === 1) {
            if (attributename === "R.C. Home Office Leader" ||
                attributename === "Technical SME") {
                return false //attributes[i].active = false
            }
        }
        if (ReportID === 2) {
            if (attributename !== "R.C. Home Office Leader" &&
                attributename !== "Technical SME") {
                return false //attributes[i].active = false
            }
        }
        return true
    }
    return true
}