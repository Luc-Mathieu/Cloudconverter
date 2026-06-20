# 🎨 PDF Converter Suite - Premium Edition with Three.js

A stunning, elegant Next.js application for converting PDF files to various formats, featuring **3D animated backgrounds** and **glassmorphism design**.

## ✨ Features

### PDF Converters
- **PDF to JPG** - Convert PDF pages to high-quality JPEG images
- **PDF to Excel** - Extract PDF content into Excel spreadsheets  
- **PDF to Word** - Convert PDFs to editable DOCX documents
- **PDF to TXT** - Extract plain text from PDFs

### Premium UI Features
- 🌌 **Animated 3D Background** - Interactive Three.js particle system with distorted spheres
- 💎 **Glassmorphism Design** - Frosted glass effect with backdrop blur
- ✨ **Smooth Animations** - Elegant transitions and hover effects
- 🎭 **Glowing Text Effects** - Animated text shadows and highlights
- 🎨 **Modern Color Scheme** - Deep space theme with purple/blue gradients
- 📱 **Fully Responsive** - Works beautifully on all screen sizes

## 🛠 Tech Stack

### Core
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **React 18** - Latest React features

### 3D & Graphics
- **Three.js** - 3D rendering engine
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers and abstractions

### PDF Processing
- **pdfjs-dist** - PDF parsing and rendering
- **xlsx** - Excel file generation
- **JSZip** - DOCX file creation
- **mammoth** - Word document processing

## 🚀 Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install --legacy-peer-deps
```

3. (Optional) Configure environment variables in `.env.local`:

```env
MAX_FILE_SIZE=10485760
IMAGE_QUALITY=85
```

## ▶️ Running the Application

Development mode:

```bash
npm run dev
```

Production build:

```bash
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 How to Use

1. **Navigate** to http://localhost:3000
2. **Enjoy** the 3D animated background
3. **Select** a converter card
4. **Upload** your PDF file
5. **Click** the convert button
6. **Download** your converted file(s)

## 🎨 UI Features Explained

### 3D Background
- Animated particle system with 1000+ particles
- Two distorted spheres with metallic material
- Auto-rotating camera for dynamic perspective
- Ambient and directional lighting for depth

### Glassmorphism Effects
- Semi-transparent backgrounds with backdrop blur
- Subtle borders with gradient colors
- Layered shadows for depth perception
- Smooth transitions on hover

### Animations
- **Title Glow** - Pulsing glow effect on the main title
- **Fade In Up** - Cards animate in on page load
- **Hover Effects** - Cards lift and glow on hover
- **Shine Effect** - Light sweep across cards on hover
- **Ripple Buttons** - Expanding circles on button hover

## 📁 Project Structure

```
pdf-converter/
├── app/
│   ├── api/                    # API routes for conversions
│   │   ├── pdf-to-jpg/
│   │   ├── pdf-to-excel/
│   │   ├── pdf-to-word/
│   │   └── pdf-to-txt/
│   ├── globals.css             # Premium glassmorphism styles
│   ├── layout.tsx
│   └── page.tsx                # Main page with 3D background
├── components/
│   ├── ThreeBackground.tsx     # 3D animated background
│   ├── PdfToJpg.tsx
│   ├── PdfToExcel.tsx
│   ├── PdfToWord.tsx
│   └── PdfToTxt.tsx
└── Configuration files
```

## 🎯 Performance

- **Client-side** conversions for instant processing
- **Server-side** API routes for heavy operations
- **Optimized Three.js** rendering with 60fps target
- **Lazy loading** of 3D components
- **Responsive design** with no layout shift

## 🌟 Design Inspiration

The design draws inspiration from:
- Modern glassmorphism trends
- Space and cosmic themes
- Premium SaaS applications
- Interactive 3D web experiences

## 📝 Notes

- Three.js runs in the browser for maximum compatibility
- All PDF processing happens in real-time
- No data is sent to external servers
- Works offline once loaded

## 🎨 Customization

You can customize the 3D background by editing `components/ThreeBackground.tsx`:
- Change sphere colors
- Adjust particle count
- Modify animation speeds
- Add new 3D objects

## 📄 License

MIT

---

**Enjoy your premium PDF converter experience!** 🚀✨
