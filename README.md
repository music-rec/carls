# CARLS
[![Build Status](https://travis-ci.org/carls-app/carls.svg?branch=master)](https://travis-ci.org/carls-app/carls) [![Coverage Status](https://coveralls.io/repos/github/carls-app/carls/badge.svg)](https://coveralls.io/github/carls-app/carls)

## About
The Carleton community, now in pocket size!

<!--
## Download
- [Android](https://play.google.com/store/apps/details?id=com.carls) ([Sign up as a beta tester!](https://play.google.com/apps/testing/com.carls))
- [iOS](https://itunes.apple.com/us/app/all-about-olaf/id938588319) ([Sign up as a beta tester!](https://boarding-aao.herokuapp.com))
-->

## Getting Started
- Clone the repository
- `cd` into the folder
- [Install React Native](http://facebook.github.io/react-native/docs/getting-started.html#content)
- `npm install`
- `npm run ios`
    <!-- - Android setup is trickier: you'll want to launch your Android emulator first, then run `npm run android`. -->

## Note
The Calendar won't work until you give it a Google Calendar API key. You should [create one yourself](https://console.developers.google.com/projectselector/apis/credentials)!

1. Create a copy of the `.env.sample.js` file and rename it to `.env.js`
2. Insert your API key in place of the `key goes here` text

## Todo
* Bugs! All bugs should have the [`bug`](https://github.com/carls-app/carls/issues?q=is%3Aopen+is%3Aissue+label%3Abug) label in the issues
* Enhancements! All ideas for improvement that are not being worked on should be [`closed` and labelled as `discussion`](https://github.com/carls-app/carls/issues?utf8=%E2%9C%93&q=is%3Aclosed%20is%3Aissue%20label%3Astatus%2Fdiscussion)
* [3D touch actions](https://github.com/jordanbyron/react-native-quick-actions) for icon and within
* [Touch-ID](https://github.com/naoufal/react-native-touch-id) for SIS

## Contributing
Please see [CONTRIBUTING](CONTRIBUTING.md)
