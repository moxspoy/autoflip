import SLACK_USER from "./src/constants/index.js";
import FIREBASE_USER from "./src/constants/firebase-user.js";

export default {
    defaultProjectName: "Flip",
    productType: "APK",
    environment: "Regression",
    version: "1.30.0",
    whatNew: ["https://app.clickup.com/t/9nzg9w"], //you can a string of message as well
    changelog: [
        "https://app.clickup.com/t/9nzg9w",
        "https://app.clickup.com/t/a3z65k",
        "https://app.clickup.com/t/99v4dg"
    ],
    additionalNotes: "",
    notifyTo: [
        SLACK_USER.ADIT, SLACK_USER.FADEL, SLACK_USER.QA_DOMESTIC
    ],
    firebaseTester: [
        FIREBASE_USER.APP_DISTRIBUTION_GROUP.QA_B2B,
        FIREBASE_USER.APP_DISTRIBUTION_GROUP.QA_FLIP,
    ],
    autoUpdateStatusClickUp: true,
}
