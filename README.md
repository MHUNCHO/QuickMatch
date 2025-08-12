# Next.js 14 + TypeScript + Tailwind + shadcn/ui Project Template

A clean, modern Next.js 14 project template with TypeScript, Tailwind CSS, shadcn/ui, and essential libraries for building robust web applications.

## 🚀 Features

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** components built on Radix UI
- **Zustand** for state management with persistence
- **Zod** for schema validation
- **React Hook Form** for form handling
- **Dexie** for IndexedDB operations
- **Papaparse** for CSV processing
- **SheetJS** for Excel file handling

## 🛠️ Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| Next.js | React Framework | 14.x |
| React | UI Library | 18.x |
| TypeScript | Type Safety | 5.x |
| Tailwind CSS | Styling | 4.x |
| shadcn/ui | UI Components | Latest |
| Zustand | State Management | 5.x |
| Zod | Schema Validation | 4.x |
| React Hook Form | Form Handling | 7.x |
| Dexie | IndexedDB | 4.x |
| Papaparse | CSV Processing | 5.x |
| SheetJS | Excel Processing | 0.18.x |

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/             # React components
│   ├── ui/                # shadcn/ui components
│   ├── ExampleForm.tsx    # Form with validation demo
│   ├── FileUpload.tsx     # File processing demo
│   └── StoreDemo.tsx      # Zustand store demo
└── lib/                   # Utility libraries
    ├── db.ts              # Dexie database setup
    ├── file-utils.ts      # CSV/Excel utilities
    ├── schemas.ts         # Zod validation schemas
    ├── store.ts           # Zustand store
    └── utils.ts           # shadcn/ui utilities
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd codeproject
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📚 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎯 Demo Features

### 1. Zustand State Management
- Persistent counter with localStorage
- Demonstrates state management patterns

### 2. Form with Validation
- React Hook Form + Zod integration
- Real-time validation
- shadcn/ui form components

### 3. File Processing
- CSV upload and parsing with Papaparse
- Excel file handling with SheetJS
- Export functionality for both formats

### 4. Database Integration
- Dexie setup for IndexedDB
- Example CRUD operations
- Ready for offline-first applications

## 🔧 Adding New shadcn/ui Components

```bash
npx shadcn@latest add <component-name>
```

## 📝 Customization

### Adding New Schemas
Edit `src/lib/schemas.ts` to add new Zod validation schemas.

### Extending the Store
Modify `src/lib/store.ts` to add new state slices and actions.

### Database Operations
Use the Dexie setup in `src/lib/db.ts` as a template for new tables.

## 🎨 Styling

The project uses Tailwind CSS v4 with shadcn/ui's design system. Customize colors and themes in:

- `src/app/globals.css` - CSS variables
- `tailwind.config.ts` - Tailwind configuration
- `components.json` - shadcn/ui configuration

## 📱 Responsive Design

Built with mobile-first responsive design using Tailwind CSS breakpoints:

- `sm:` - 640px+
- `md:` - 768px+
- `lg:` - 1024px+
- `xl:` - 1280px+

## 🔒 Type Safety

Full TypeScript support with:
- Strict type checking
- Interface definitions for all data structures
- Type-safe form handling
- Generic utility functions

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Other Platforms
```bash
npm run build
npm run start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

For questions or issues:
1. Check the [Next.js documentation](https://nextjs.org/docs)
2. Review [shadcn/ui docs](https://ui.shadcn.com/)
3. Open an issue in this repository

---

Built with ❤️ using Next.js 14 and modern web technologies.
