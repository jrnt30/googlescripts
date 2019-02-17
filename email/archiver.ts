import 'google-apps-script';

const RETENTION_LABEL = /retention\//;
const AUTO_ARCHIVE = "label:auto-archive in:inbox";
const DAY_IN_MILIS = 1000 * 60 * 60 * 24;

type ThreadDict = { [index: string]: GoogleAppsScript.Gmail.GmailThread[] }

function emailArchiver() {
  var threadsByLabel: ThreadDict =
    GmailApp.search(AUTO_ARCHIVE).reduce(
      (threads, curThread) => {
        // NOTE: Initially was using curThread.getLabels().find(...) but this was resolving to
        // undefined in the suite which I didn't quite understand so took this approach
        let retLabels = curThread.getLabels().filter((lbl) => RETENTION_LABEL.test(lbl.getName()))
        if (retLabels.length){
          let threadArray = threads[retLabels[0].getName()] || [];
          threadArray.push(curThread);
          threads[retLabels[0].getName()] = threadArray;
        }
        return threads;
      }, {});

  var now = Date.now();
  for (let retentionTime in threadsByLabel) {
    let retentionDays = parseInt(retentionTime.split(RETENTION_LABEL)[1]);
    let minDate = new Date(now - DAY_IN_MILIS * retentionDays);
    var threads = threadsByLabel[retentionTime].filter( th => minDate > th.getLastMessageDate())
    Logger.log(`Archiving ${threads.length} threads with retention ${retentionDays}`)
    while(threads.length) {
      GmailApp.moveThreadsToArchive(threads.splice(0,100));
    }
  }
}
