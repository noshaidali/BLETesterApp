#!/bin/bash

# Setup script for CI/CD pipeline
# This script helps set up the local environment for testing the CI/CD pipeline

set -e

echo "🚀 Setting up CI/CD pipeline for BLETesterApp..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm install

# Install Ruby dependencies
echo "💎 Installing Ruby dependencies..."
bundle install

# Install iOS dependencies
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 Installing iOS dependencies..."
    cd ios
    pod install
    cd ..
else
    echo "⚠️  Skipping iOS dependencies (not on macOS)"
fi

# Install Android dependencies
echo "🤖 Setting up Android dependencies..."
cd android
./gradlew dependencies
cd ..

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p .github/workflows
mkdir -p fastlane

# Check if environment file exists
if [ ! -f ".env" ]; then
    echo "⚠️  Environment file not found. Please copy env.example to .env and configure it."
    if [ -f "env.example" ]; then
        cp env.example .env
        echo "✅ Created .env file from template"
    fi
fi

# Validate Fastlane configuration
echo "🔍 Validating Fastlane configuration..."
if command -v fastlane &> /dev/null; then
    fastlane lanes
    echo "✅ Fastlane configuration is valid"
else
    echo "⚠️  Fastlane not found. Please install it: gem install fastlane"
fi

# Check GitHub Actions syntax
echo "🔍 Checking GitHub Actions workflows..."
if command -v yamllint &> /dev/null; then
    yamllint .github/workflows/*.yml
    echo "✅ GitHub Actions workflows are valid"
else
    echo "⚠️  yamllint not found. Please install it to validate YAML syntax"
fi

echo "✅ CI/CD setup complete!"
echo ""
echo "Next steps:"
echo "1. Configure GitHub Secrets in your repository settings"
echo "2. Set up your Apple Developer and Google Play Console accounts"
echo "3. Test the pipeline by pushing to your repository"
echo "4. Check the CI_CD_SETUP.md file for detailed instructions"

