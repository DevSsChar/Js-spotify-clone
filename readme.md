# 🚀 Vanilla JS Spotify Clone

---

## 📦 Features

- **Dark Themed UI**  
  - The entire application uses a black background, giving it a modern, cinematic look.
  - All text, controls, and visuals are optimized for a dark environment.

- **Playlist & Album Display**  
  - Uses hard-coded manifests for songs and album metadata.
  - Displays album cards with cover art, title, and description.
  - Clicking an album loads its list of songs into the library view.

- **Audio Playback Controls**  
  - **Play/Pause:** Toggle playback with a single button.
  - **Next/Previous:** Circular navigation so that when you’re at the last song, clicking next loops to the first song, and vice versa for the previous button.
  - **Automatic Track Advancement:** When a song ends, it will automatically move to the next song.
  - **Loop Toggle:** An option to loop the current song. When loop is enabled, the song restarts when it ends; otherwise, it advances to the next track.

- **User Interface Interactions**  
  - **Seek Bar:** Displays the current time and total duration. Users can click on the seek bar to jump to a new position within the track.
  - **Volume Control & Mute Toggle:** Adjust the volume via a range input and toggle mute by clicking the volume icon.
  - **Responsive Design:**  
    - On mobile, a hamburger menu is used to show/hide the side navigation.
    - The layout is optimized for both desktop and mobile views.
  - **Lock Screen Controls via Media Session API (Optional):**  
    - On supported devices, the Media Session API displays song metadata and controls (play, pause, previous, next) on the mobile lock screen.

---

## 📁 Project Structure

```
spotify-clone/
├── index.html          # Main HTML file
├── style.css           # Main stylesheet (includes dark theme styling)
├── utility.css         # Utility CSS classes
└── script.js           # Main JavaScript file handling playback, UI events, and more
```

---

## 💡 How It Works

### 1️⃣ Manifest-Based Playlists  
Instead of fetching a directory listing (which can be problematic in production), the project uses JavaScript objects (`songsManifest` and `albumsManifest`) to define available songs and album metadata.

### 2️⃣ Audio Playback Management  
- An HTML5 `Audio` object is used for music playback.
- Event listeners are attached for play, pause, previous, next, and loop functionality.
- When a song ends, if loop mode is enabled, the same song is replayed; otherwise, it automatically advances to the next song (with circular navigation).

### 3️⃣ Responsive & Mobile-Friendly  
- The UI adapts to different screen sizes using CSS media queries.
- A mobile hamburger menu is provided to navigate the side panel.
- The dark theme is maintained throughout all device views.

---

## 🔧 How to Run the Project

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2️⃣ Open the Project
Open the `index.html` file in your browser to run the application locally.

**Tip:** Use a local web server (e.g., the Live Server extension in VS Code) for best results.

---

## 🎨 Customization

### 🎵 Song & Album Data  
Modify the `songsManifest` and `albumsManifest` objects in `script.js` to add or remove songs and albums.

### 🎨 UI & Styling  
Customize `style.css` and `utility.css` to adjust the appearance. The current design is built on an all-black background—feel free to modify it as desired.

### 🚀 Additional Features  
Extend functionality by integrating the **Media Session API** for enhanced mobile lock screen controls, or add new playback features.

---

## 📜 License
This project is open source and available under the **MIT License**.

---

## 🙌 Acknowledgments
- Icons and SVG assets were chosen and designed to complement the dark theme.
- This project was created as a learning tool to demonstrate audio playback, UI control, and responsive design using Vanilla JavaScript.
