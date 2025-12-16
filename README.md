# Banderas Nila Lopez

A professional Angular website for Banderas Nila Lopez, built with Angular 21 and modern web technologies.

![Website Preview](https://github.com/user-attachments/assets/8488190c-45d3-4560-93eb-6e3c3195d90a)

## Features

- **Modern Angular 21**: Built with the latest version of Angular framework
- **Responsive Design**: Fully responsive layout that works on all devices
- **Professional UI**: Clean and professional design with gradient styling
- **Multiple Sections**:
  - Hero section with call-to-action
  - About Us section with mission, vision, and values
  - Services showcase
  - Contact information
- **Smooth Navigation**: Sticky header with smooth scrolling to sections
- **SEO Ready**: Proper HTML structure and meta tags

## Prerequisites

- Node.js (v20.x or higher)
- npm (v10.x or higher)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/WilmerKopernikus/banderas_nila_lopez.git
cd banderas_nila_lopez
```

2. Install dependencies:
```bash
npm install
```

## Development

Run the development server:

```bash
npm start
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Build the project for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Running Tests

Run unit tests:

```bash
npm test
```

## Project Structure

```
banderas-nila-lopez/
├── src/
│   ├── app/
│   │   ├── app.ts          # Main component
│   │   ├── app.html        # Main template
│   │   ├── app.css         # Component styles
│   │   ├── app.config.ts   # Application configuration
│   │   └── app.routes.ts   # Routing configuration
│   ├── index.html          # Main HTML file
│   ├── main.ts             # Application entry point
│   └── styles.css          # Global styles
├── public/                 # Static assets
├── angular.json            # Angular CLI configuration
├── package.json            # Dependencies and scripts
└── tsconfig.json           # TypeScript configuration
```

## Technologies Used

- **Angular 21**: Modern web application framework
- **TypeScript**: Type-safe JavaScript
- **CSS3**: Modern styling with gradients and animations
- **RxJS**: Reactive programming library

## Customization

### Changing Colors

The main color scheme uses a purple gradient. To customize:

1. Edit `src/app/app.css`
2. Modify the gradient values in the header and hero sections:
   - `#667eea` (primary purple)
   - `#764ba2` (secondary purple)

### Adding New Sections

1. Add the section HTML in `src/app/app.html`
2. Add corresponding styles in `src/app/app.css`
3. Update the navigation menu if needed

### Contact Information

Update contact details in `src/app/app.html` in the contact section:
- Email
- Phone
- Location

## License

This project is private and proprietary.

## Support

For support, email info@banderasnilalopez.com or call +1 (555) 123-4567.
