
<a href="https://flip.id/">
<img src="https://i.ibb.co/nmw3Z22/autoflip-compressed-removebg-preview.png" alt="autoflip-compressed-removebg-preview" border="0" height="200" style="margin-left: -25px">
</a>

# Autoflip
Productivity tools to automate deployment in Flip mobile apps

![workflow](https://img.shields.io/github/workflow/status/moxspoy/autoflip/Node.js%20CI)

## Motivation
Our current development process is a bit painful. Why?
- We need to wait build to be successful, and then upload it manually into Slack or firebase
- We often forget to do simple thing, like patch a file before deploy apps
- Our release process contains many steps. It is hard to remember all scripts that needed such as sentry and how to release oppo store
- When we want to run it on server, it is hard for new joiner/devops to know all processes

Those problems that motivate me to create this project. We can not rely to use
existing deployment tools (such as Codemagic or CircleCI) because we have stages that can not be done 
by those existing tools. We want to make full control to make our deployment run smoothly,

## Prerequisites
You must be able to build the flip mobile app project manually (I assume that XCode, Java, Android SDK, and so on are installed on your system)


## Usage
1. Clone this project
2. `yarn install`
3. Ask `.env` file for this project to eqi@flip.id, and then change `FLIP_MOBILE_DIR` and `AUTOFLIP_DIR`
4. If you want to release ios, you need to add Firebase into your cli. `npm install -g firebase-tools`. Then login using `firebase login`
5. Edit release notes in `release-notes.js`
6. You can run following scripts

Script  | Description
------------- | -------------
`yarn android_regression`  | When you want to build release version in staging mode and send to Slack
`yarn android_sanity` | When you want to build release version in production mode and send to Slack
`yarn android_oppo` | Build android apps for oppo and notify to Slack
`yarn android_staging_debug_slack` | Build android apps staging debug only and notify to Slack
`yarn android_clean` | Clean android apps build folder
`yarn ios_regression` | When you want to build release version in staging mode, send to Firebase App distribution, and notify to Slack
`yarn ios_sanity` | When you want to build release version in production mode, send to Firebase App distribution, and notify to Slack
`yarn ios_clean` | Clean ios apps build folder
`yarn sentry_android` | Upload sourcemaps to Sentry for Android
`yarn sentry_ios` | Upload sourcemaps to Sentry for iOS


## How it works
When you run the command, it will execute build command (using gradle for Android and xcodebuild for iOS) and will produce the artifact (APK/IPA).
After that, we will find apk or ipa in the folder and the we upload into Slack/Firebase.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
