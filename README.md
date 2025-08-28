# Gemini Image Generator

[![Version](https://img.shields.io/badge/version-1.1.1-blue.svg)](https://github.com/guitaripod/minibanana/releases/tag/v1.1.1)

A React TypeScript web application for generating and editing images using Google's Gemini 2.5 Flash Image Preview model.

## Features

- **Text-to-Image Generation**: Create images from text descriptions
- **Image Editing**: Upload an image and edit it with text prompts
- **System Theme**: Automatically follows your system's dark/light mode preference
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Production Ready**: Built with TypeScript, proper error handling, and modern React practices

## Recent Updates

- **v1.1.1**: Fixed image generation API response parsing bug
- **v1.1.0**: Enhanced API key management with modal interface
- **v1.0.0**: Initial release with text-to-image and image editing features

## Tech Stack

- React 19
- TypeScript
- Vite
- Gemini 2.5 Flash Image Preview API

## Setup

1. Clone the repository
2. Install dependencies:
    ```bash
    npm install
    ```
3. **Option 1: Environment Variable**
   Create a `.env` file with your Gemini API key:
    ```
    VITE_GEMINI_API_KEY=your_api_key_here
    ```

4. **Option 2: Runtime Configuration**
   Start the app and use the API key modal to enter your key at runtime

5. Start the development server:
    ```bash
    npm run dev
    ```
6. Open http://localhost:5173 in your browser

## Development

```bash
# Start development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint
```

## Build for Production

```bash
# Clean previous build
npm run clean

# Build for production
npm run build

# Preview production build
npm run preview
```

The built files will be in the `dist` directory.

## Usage

### System Theme
The app automatically adapts to your system's dark/light mode preference and updates in real-time when you change your system settings.

### Text to Image
1. Select the "Text to Image" tab
2. Enter a descriptive prompt
3. Click "Generate Image"
4. Download the generated image

### Image Editing
1. Select the "Image Editing" tab
2. Upload an image file
3. Enter editing instructions
4. Click "Edit Image"
5. Download the edited image

## API Reference

The app uses the Gemini 2.5 Flash Image Preview API:
- Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent`
- Supports text-to-image and image editing with text prompts

## Security Notes

- API key is stored in environment variables
- Images are processed client-side
- No user data is stored on the server

## License

MIT