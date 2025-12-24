# YGGMollo Firefox Makefile

# Variables
EXTENSION_NAME = yggmollo-firefox
VERSION = 1.0.0
BUILD_DIR = build
ZIP_NAME = $(EXTENSION_NAME)-v$(VERSION).zip

# Files to include in the extension
EXTENSION_FILES = manifest.json \
	content.js \
	background.js \
	options.html \
	options.js \
	styles.css \
	icons/ \
	assets/

# Default target
.PHONY: all
all: build

# Build the extension ZIP file
.PHONY: build
build: clean
	@echo "Building $(ZIP_NAME)..."
	@mkdir -p $(BUILD_DIR)
	@zip -r $(BUILD_DIR)/$(ZIP_NAME) $(EXTENSION_FILES) \
		-x "*.DS_Store" \
		-x "icons/icon.png"
	@echo "✓ Extension built: $(BUILD_DIR)/$(ZIP_NAME)"
	@ls -lh $(BUILD_DIR)/$(ZIP_NAME)

# Clean build artifacts
.PHONY: clean
clean:
	@echo "Cleaning build directory..."
	@rm -rf $(BUILD_DIR)
	@echo "✓ Clean complete"

# Install dependencies (if any)
.PHONY: install
install:
	@echo "No dependencies to install"

# Help
.PHONY: help
help:
	@echo "YGGMollo - Available commands:"
	@echo ""
	@echo "  make build    - Build the extension ZIP file"
	@echo "  make clean    - Remove build artifacts"
	@echo "  make help     - Show this help message"
	@echo ""
	@echo "Output: $(BUILD_DIR)/$(ZIP_NAME)"
