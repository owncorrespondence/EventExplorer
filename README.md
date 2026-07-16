# Welcome to your new ignited app!

> The latest and greatest boilerplate for Infinite Red opinions

This is the boilerplate that [Infinite Red](https://infinite.red) uses as a way to test bleeding-edge changes to our
React Native stack.

- [Quick start documentation](https://github.com/infinitered/ignite/blob/master/docs/boilerplate/Boilerplate.md)
- [Full documentation](https://github.com/infinitered/ignite/blob/master/docs/README.md)

## Getting Started

Prerequisites
Make sure you have the following versions installed. These are the versions this project was built and tested against.

Tool	Version	Notes
Node	v22.11.0
Ruby	3.3.2	Install via rbenv. Required for CocoaPods (iOS).
Java	17 (OpenJDK 17 LTS)	Required for Android builds.

Verify your local versions:

node -v      # v22.11.0
ruby -v      # ruby 3.3.2 (2024-05-30 revision e5a195edf6) [arm64-darwin25]
java --version   # openjdk 17.0.15 2025-04-15 LTS
Ruby: any recent 3.3.x should work; 3.3.2 is confirmed. If pod install fails, check that ruby -v points at your rbenv version and not the system Ruby.

Environment setup
Create a .env file in the project root with your Ticketmaster API key:

TICKETMASTER_API_KEY="your_own_key_here"
Get a key from the Ticketmaster Developer Portal. The .env file is git-ignored — never commit your key.

Getting started
Install dependencies and start the app:

yarn install
yarn start


