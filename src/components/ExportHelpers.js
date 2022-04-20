import {
    saveAs
} from "file-saver";
import XlsxPopulate from 'xlsx-populate/browser/xlsx-populate';

//Comparer method to sort summary records by priority
const compareSummaryData = (a, b) => {
    if (a.priority.toLowerCase() === "high" || b.priority.toLowerCase() === "low") {
        return -1
    }
    if (a.priority.toLowerCase() === "low" || b.priority.toLowerCase() === "high") {
        return 1;
    }
    return 0;
}

//Sums actual hours from subtasks, and generate sheetdate
const getSummarySheetData = (data, header, name) => {
    let sheetData = [];
    let total = 0;
    let title = "Team Member Work Summary for " + name;
    sheetData.push(["", title, "", ""]);
    sheetData.push(header);
    data.sort(compareSummaryData);
    data.forEach(story => {
        let row = [];
        row.push(story.priority);
        row.push(story.portion);
        let users = [];
        story.subtasks?.forEach(subtask => {
            subtask.workedby?.forEach(user => {
                let index = users.findIndex(element => element._id === user._id);
                total += user.actHours;
                if (index === -1) {
                    users.push(user);
                } else {
                    users[index].actHours += user.actHours;
                }
            })
        })
        if (users[0]?.firstName && users[0]?.lastName) {
            row.push("" + users[0]?.firstName + " " + users[0]?.lastName);
        }
        row.push(users[0]?.actHours);
        sheetData.push(row);
        users.shift();
        users?.forEach(user => {
            row = [];
            row.push("");
            row.push("");
            row.push("" + user?.firstName + " " + user?.lastName);
            row.push(user.actHours);
            sheetData.push(row);
        })
        sheetData.push(["", "", "", ""]);
    })
    let row = [];
    row.push("");
    row.push("Total:");
    row.push("");
    row.push(total);
    sheetData.push(row);
    return sheetData;
}
export const exportWorkSummary = async (elements, name) => {
    console.log(elements);
    let header = ["Priority", "User Stories", "Team Member", "Actual Hours"];

    XlsxPopulate.fromBlankAsync().then(async (workbook) => {
        const sheet = workbook.sheet(0);
        const sheetData = getSummarySheetData(elements, header, name);
        const totalColumns = sheetData[1].length;

        sheet.cell("A1").value(sheetData);
        sheet.column("B").width(45);
        sheet.column("C").width(20);
        sheet.column("D").width(15);
        const range = sheet.usedRange();
        const endColumn = String.fromCharCode(64 + totalColumns);
        //console.log(endColumn);
        sheet.row(2).style("bold", true);
        sheet.column(2).style("bold", true);
        sheet.column(4).style("horizontalAlignment", "center");
        sheet.range("A2:" + endColumn + "2").style("fill", "BFBFBF");
        range.style("border", true);
        return workbook.outputAsync().then((res) => {
            saveAs(res, `${name} Work Summary.xlsx`);
        });
    });
}

//Sums actual hours from subtasks, and generate sheetdate
const getRetrospectiveSheetData = (data, header, name) => {
    let sheetData = [];
    let totalOrig = 0;
    let totalAct = 0;
    let totalRe = 0;
    let title =  name +  " Retrospective ";
    sheetData.push([title, "", "", "", "", ""]);
    sheetData.push(header);
    data.forEach(story => {
        let storyRow = [];
        let subtaskRows = [];
        let storyOrig = 0;
        let storyAct = 0;
        let storyRe = 0;
        storyRow.push(story.portion);
        storyRow.push("");
        story.subtasks?.forEach(subtask => {
            let subtaskRow = [];
            let subtaskOrig = 0;
            let subtaskAct = 0;
            let subtaskRe = 0;
            let users = "";
            subtaskRow.push(subtask.name);
            subtask.workedby?.forEach(user => {
                storyOrig += user?.estHours || 0;
                storyAct += user?.actHours || 0;
                storyRe += user?.reestHours || 0;
                subtaskOrig += user?.estHours || 0;
                subtaskAct += user?.actHours || 0;
                subtaskRe += user?.reestHours || 0;
                users += user?.firstName + " " +  user?.lastName + "    ";
            })
            subtaskRow.push(users);
            subtaskRow.push(" ");
            subtaskRow.push(subtaskOrig);
            subtaskRow.push(subtaskAct);
            subtaskRow.push(subtaskRe);
            subtaskRows.push(subtaskRow);
        })
        let percentage =  (storyAct + storyRe) === 0? "N/A" :  (100.0 *storyAct / (storyAct + storyRe)).toFixed(2) + "%";
        storyRow.push(percentage);
        storyRow.push(storyOrig);
        storyRow.push(storyAct);
        storyRow.push(storyRe);
        sheetData.push(storyRow);
        subtaskRows.forEach(subtaskRow =>{
            sheetData.push(subtaskRow);
        })
        totalOrig += storyOrig;
        totalAct += storyAct;
        totalRe += storyRe;
        sheetData.push(["", "", "", "", "", ""]);
    })

    let percentage =  (totalAct + totalRe) === 0? "N/A" :  (100.0 *totalAct / (totalAct + totalRe)).toFixed(2) + "%";
    let totalRow = [];
    totalRow.push("Total");
    totalRow.push("");
    totalRow.push(percentage);
    totalRow.push(totalOrig);
    totalRow.push(totalAct);
    totalRow.push(totalRe);
    sheetData.push(totalRow);
    return sheetData;
}
export const exportRetrospective = async(elements, name) =>{
    let header = ["User Stories/Sub tasks", "", "Percentage Complete", "Origional Hours Est.", "Actual Hours Worked", "Re-Estimate to Complete"];
    XlsxPopulate.fromBlankAsync().then(async (workbook) => {
        const sheet = workbook.sheet(0);
        const sheetData = getRetrospectiveSheetData(elements, header, name);
        const totalColumns = sheetData[1].length;

        sheet.cell("A1").value(sheetData);
        sheet.column("A").width(45);
        sheet.column("B").width(25);
        sheet.column("C").width(25);
        sheet.column("D").width(25);
        sheet.column("E").width(25);
        sheet.column("F").width(25);
        sheet.column(2).style("horizontalAlignment", "center");
        sheet.column(3).style("horizontalAlignment", "center");
        sheet.column(4).style("horizontalAlignment", "center");
        sheet.column(5).style("horizontalAlignment", "center");
        sheet.column(6).style("horizontalAlignment", "center");
        const range = sheet.usedRange();
        const endColumn = String.fromCharCode(64 + totalColumns);
        sheet.row(2).style("bold", true);
        sheet.range("A2:" + endColumn + "1").style("fill", "BFBFBF");
        range.style("border", true);
        let storyRow = true;
        //if cell is a user story, set it to left alignments
        //else set it to right alignment
        for(let i = 3; i < sheetData.length; ++i){
            //if the cell is blank, it means we reached the end of a story
            if(sheet.cell("A" + i)._value === ""){
                storyRow = true;
                continue;
            }
            if(storyRow){
                sheet.cell("A" + i).style("horizontalAlignment", "left");
                sheet.range("A" + i + ":B" + i).merged(true);
                storyRow = false;
            }else{
                sheet.cell("A" + i).style("horizontalAlignment", "right");
            }
        }
        return workbook.outputAsync().then((res) => {
            saveAs(res, `${name} Retrospective.xlsx`);
        });
    });
}