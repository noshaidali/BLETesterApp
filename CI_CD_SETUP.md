# CI/CD Setup Guide for BLETesterApp

This guide explains how to set up the CI/CD pipeline for your React Native BLE Tester App using GitHub Actions and Fastlane.

## Overview

The CI/CD pipeline includes:
- **CI (Continuous Integration)**: Automated linting and builds on every push/PR
- **CD (Continuous Deployment)**: Automated deployments that run only after CI succeeds
- **Fastlane**: Automated build and store submission with bundler

## Prerequisites

1. GitHub repository with Actions enabled
2. Apple Developer Account (for iOS)
3. Google Play Console Account (for Android)
4. App signing certificates and provisioning profiles

## Setup Instructions

### 1. GitHub Secrets Configuration

Go to your GitHub repository → Settings → Secrets and variables → Actions, and add the following secrets:

#### iOS Secrets
- `APPLE_ID`: Your Apple ID email
- `APPLE_ID_PASSWORD`: App-specific password (not your regular password)
- `IOS_TEAM_ID`: Your Apple Developer Team ID
- `MATCH_PASSWORD`: Password for code signing certificates
- `FASTLANE_SESSION`: Session token for 2FA (optional)

#### Android Secrets
- `ANDROID_KEYSTORE_PATH`: Path to your keystore file
- `ANDROID_KEYSTORE_PASSWORD`: Keystore password
- `ANDROID_KEY_ALIAS`: Key alias
- `ANDROID_KEY_PASSWORD`: Key password
- `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON`: Service account JSON for Google Play Console

### 2. Android Keystore Setup

1. Generate a keystore file:
```bash
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

2. Place the keystore file in your project root
3. Update `android/app/build.gradle` with your keystore configuration

### 3. iOS Code Signing Setup

1. Set up Match for code signing:
```bash
fastlane match init
fastlane match development
fastlane match appstore
```

2. Configure your Apple Developer account with the necessary certificates

### 4. Google Play Console Setup

1. Create a service account in Google Cloud Console
2. Download the JSON key file
3. Add the service account to your Google Play Console project
4. Upload the JSON content as `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON` secret

## Workflow Files

### CI Workflow (`.github/workflows/ci.yml`)
- Triggers on every push and pull request to `main`, `develop`, `Fastlane-integration`
- Runs `lint` first, then builds Android and iOS in parallel
- Uploads build artifacts (APK and iOS build output)

### CD Workflow (`.github/workflows/cd.yml`)
- Triggered via `workflow_run` and starts only after the CI workflow completes successfully
- Production deploys on `main` branch and `v*` tags
- Beta deploys on `develop` and `Fastlane-integration` branches
- Uses `bundle exec fastlane` for all lanes
- Validates required secrets before attempting deployments

### Fastlane Workflow (`.github/workflows/fastlane.yml`)
- Manual workflow for running specific Fastlane lanes
- Useful for testing lanes locally in CI without full CD

## Fastlane Lanes

### iOS Lanes
- `fastlane ios build_dev`: Build for development
- `fastlane ios beta`: Build and upload to TestFlight
- `fastlane ios release`: Build and upload to App Store

### Android Lanes
- `fastlane android build_debug`: Build debug APK
- `fastlane android build_apk`: Build release APK (no upload)
- `fastlane android beta`: Build and upload to Google Play Internal testing
- `fastlane android release`: Build and upload to Google Play (production)

### Common Lanes
- `fastlane test`: Run tests
- `fastlane lint`: Run linting
- `fastlane setup`: Setup project dependencies

## Usage

### Automatic Deployment
- Push to `main` branch → CI runs; on success CD deploys to production (iOS and Android)
- Push to `develop` or `Fastlane-integration` → CI runs; on success CD deploys to beta (TestFlight and Google Play Internal)
- Create a tag starting with `v` → CI runs; on success CD deploys to production

### Manual Deployment
1. Go to Actions tab in GitHub
2. Select "Fastlane" workflow
3. Click "Run workflow"
4. Choose platform and lane
5. Click "Run workflow"

### Local Development
```bash
# Install dependencies (Ruby + JS)
bundle install
npm install

# Run Fastlane locally (always via bundler)
bundle exec fastlane ios build_dev
bundle exec fastlane ios beta
bundle exec fastlane android build_debug
bundle exec fastlane android beta
```

## Troubleshooting

### Common Issues

1. **Code Signing Issues**: Ensure certificates are properly configured in Apple Developer Portal
2. **Keystore Issues**: Verify keystore file path and passwords are correct
3. **Google Play Issues**: Check service account permissions and JSON format
4. **Bundler/Fastlane Issues**: Always use `bundle exec fastlane` so the correct gem versions load
5. **CocoaPods**: The iOS lanes run `pod install` against `ios/Podfile`; ensure Xcode CLTs are installed

### Debug Commands
```bash
# Check Fastlane configuration
fastlane lanes

# Run specific lane with verbose output
fastlane ios build_dev --verbose

# Check iOS build
cd ios && xcodebuild -list

# Check Android build
cd android && ./gradlew tasks
```

## Security Notes

- Never commit keystore files or certificates to the repository
- Use GitHub Secrets for all sensitive information
- Regularly rotate API keys and passwords
- Use app-specific passwords for Apple ID

## Support

For issues with:
- Fastlane: Check [Fastlane documentation](https://docs.fastlane.tools/)
- GitHub Actions: Check [GitHub Actions documentation](https://docs.github.com/en/actions)
- React Native: Check [React Native documentation](https://reactnative.dev/)

