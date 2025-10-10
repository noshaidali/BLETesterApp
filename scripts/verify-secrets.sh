#!/bin/bash

# Script to verify GitHub Secrets configuration
# This script helps you check if all required secrets are properly configured

echo "🔍 Verifying GitHub Secrets Configuration..."
echo ""

# Check if we're in a GitHub Actions environment
if [ -n "$GITHUB_ACTIONS" ]; then
    echo "✅ Running in GitHub Actions environment"
    
    # Check iOS secrets
    echo ""
    echo "🍎 Checking iOS Secrets:"
    
    if [ -n "$APPLE_ID" ]; then
        echo "✅ APPLE_ID is set"
    else
        echo "❌ APPLE_ID is missing"
    fi
    
    if [ -n "$APPLE_ID_PASSWORD" ]; then
        echo "✅ APPLE_ID_PASSWORD is set"
    else
        echo "❌ APPLE_ID_PASSWORD is missing"
    fi
    
    if [ -n "$IOS_TEAM_ID" ]; then
        echo "✅ IOS_TEAM_ID is set"
    else
        echo "❌ IOS_TEAM_ID is missing"
    fi
    
    if [ -n "$MATCH_PASSWORD" ]; then
        echo "✅ MATCH_PASSWORD is set"
    else
        echo "❌ MATCH_PASSWORD is missing"
    fi
    
    # Check Android secrets
    echo ""
    echo "🤖 Checking Android Secrets:"
    
    if [ -n "$ANDROID_KEYSTORE_PATH" ]; then
        echo "✅ ANDROID_KEYSTORE_PATH is set"
    else
        echo "❌ ANDROID_KEYSTORE_PATH is missing"
    fi
    
    if [ -n "$ANDROID_KEYSTORE_PASSWORD" ]; then
        echo "✅ ANDROID_KEYSTORE_PASSWORD is set"
    else
        echo "❌ ANDROID_KEYSTORE_PASSWORD is missing"
    fi
    
    if [ -n "$ANDROID_KEY_ALIAS" ]; then
        echo "✅ ANDROID_KEY_ALIAS is set"
    else
        echo "❌ ANDROID_KEY_ALIAS is missing"
    fi
    
    if [ -n "$ANDROID_KEY_PASSWORD" ]; then
        echo "✅ ANDROID_KEY_PASSWORD is set"
    else
        echo "❌ ANDROID_KEY_PASSWORD is missing"
    fi
    
    if [ -n "$GOOGLE_PLAY_SERVICE_ACCOUNT_JSON" ]; then
        echo "✅ GOOGLE_PLAY_SERVICE_ACCOUNT_JSON is set"
    else
        echo "❌ GOOGLE_PLAY_SERVICE_ACCOUNT_JSON is missing"
    fi
    
else
    echo "⚠️  This script is designed to run in GitHub Actions environment"
    echo "   To test locally, you can:"
    echo "   1. Push your code to GitHub"
    echo "   2. Go to Actions tab"
    echo "   3. Run the Fastlane workflow manually"
    echo "   4. Check the logs for any missing secrets"
fi

echo ""
echo "📋 Required Secrets Checklist:"
echo "   iOS:"
echo "   - APPLE_ID"
echo "   - APPLE_ID_PASSWORD"
echo "   - IOS_TEAM_ID"
echo "   - MATCH_PASSWORD"
echo "   - FASTLANE_SESSION (optional)"
echo ""
echo "   Android:"
echo "   - ANDROID_KEYSTORE_PATH"
echo "   - ANDROID_KEYSTORE_PASSWORD"
echo "   - ANDROID_KEY_ALIAS"
echo "   - ANDROID_KEY_PASSWORD"
echo "   - GOOGLE_PLAY_SERVICE_ACCOUNT_JSON"
echo ""
echo "💡 If any secrets are missing, add them in:"
echo "   Repository Settings → Secrets and variables → Actions"
