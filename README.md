# 🏢 Colony Complaints Management System

A comprehensive web and desktop application for managing residential colony complaints efficiently. Built with Node.js, Express, SQLite, and Electron.

![Colony Complaints System](https://img.shields.io/badge/version-1.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)

## ✨ Features

### 📊 Dashboard
- Real-time statistics (Pending, In Progress, Completed)
- Today's complaints count
- This week and month overview
- Trade-wise breakdown
- Interactive stat cards

### 📝 Complaint Management
- Add new complaints with detailed information
- Edit and update complaint status
- Delete complaints (Admin only - coming soon)
- Filter by date range, trade type, and status
- Real-time search functionality
- Bulk print selected complaints

### 📈 Reports & Analytics
- **Daily Reports** - View complaints for specific dates
- **Monthly Reports** - Comprehensive monthly summaries
- **Custom Range Reports** - Flexible date range selection
- **Quick Stats** - Clickable Today/Week/Month cards
- Professional print layout with serial numbers
- Export to CSV for Excel analysis

### 🎨 User Interface
- **Dual Language Support** - English & Urdu (اردو)
- **Dark/Light Theme** - Toggle between modes
- **Responsive Design** - Works on all screen sizes
- **Modern UI** - Clean, professional interface
- **Print-Optimized** - Beautiful printed reports

### 💻 Desktop Application
- Standalone Electron app
- Works completely offline
- No internet required
- Native Windows application
- Custom icon and branding

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** SQLite3
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Desktop:** Electron
- **Icons:** Font Awesome
- **Charts:** Chart.js (ready for future analytics)

## 📋 Trade Types Supported

- 🔧 Plumber
- ⚡ Electrician
- 🪚 Carpenter
- 🎨 Painter
- 🧹 Sweeper
- 🧱 Mason
- 🌱 Gardener
- 🚰 Sewerage

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/imran350/colony-complaints.git
cd colony-complaints
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the application**
```bash
npm start
```

4. **Open in browser**
```
http://localhost:3000
```

## 💻 Desktop App

### Run in development mode
```bash
npm run electron
```

### Build portable executable
```bash
npm run build-win-portable
```

The portable `.exe` file will be created in the `build-output` folder.

## 📖 Usage

### Adding a Complaint
1. Click on "New Complaint" in the sidebar
2. Fill in the details (Date, Flat Number, Trade Type, Description)
3. Optionally assign to a worker
4. Click "Save Complaint"

### Generating Reports
1. Go to "Reports" section
2. Choose report type (Daily/Monthly/Custom)
3. Select date or date range
4. Click "Generate Report"
5. View, Print, or Export to CSV

### Quick Stats
- Click on "Today's Complaints" card for instant today's report
- Click on "This Week" for current week report
- Click on "This Month" for current month report

## 🗂️ Project Structure

```
colony-complaints/
├── public/              # Frontend files
│   ├── index.html      # Main HTML
│   ├── app.js          # Frontend JavaScript
│   ├── styles.css      # Styling
│   └── icons.css       # Font Awesome icons
├── server.js           # Express server & API
├── electron-main.js    # Electron main process
├── preload.js          # Electron preload script
├── complaints.db       # SQLite database (auto-created)
├── package.json        # Dependencies
└── README.md           # This file
```

## 🔧 Configuration

### Database
The SQLite database (`complaints.db`) is automatically created on first run. No manual setup required.

### Port
Default port is `3000`. To change, edit `server.js`:
```javascript
const PORT = process.env.PORT || 3000;
```

## 🔜 Upcoming Features

- 🔐 **Admin Login System** - Secure authentication
- 👥 **User Roles** - Admin, Manager, Worker
- 📸 **Photo Attachments** - Upload images with complaints
- 📱 **SMS Notifications** - Alert on complaint completion
- 📊 **Advanced Analytics** - Charts and graphs
- 🔔 **Overdue Alerts** - Notify pending complaints
- 🌐 **Online Deployment** - Cloud hosting

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Imran**
- GitHub: [@imran350](https://github.com/imran350)

## 🙏 Acknowledgments

- Built with assistance from Claude AI
- Font Awesome for icons
- SQLite for reliable database
- Electron for desktop app framework

## 📞 Support

For issues or questions, please open an issue on GitHub:
https://github.com/imran350/colony-complaints/issues

---

Made with ❤️ for efficient colony management
