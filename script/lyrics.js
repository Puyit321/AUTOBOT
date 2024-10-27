const axios = require('axios');
const fs = require('fs-extra');

module.exports.config = {
  name: 'lyrics',
  version: '1.0.0',
  role: 0,
  hasPrefix: true,
  credits: 'Developer',
  description: 'Fetches lyrics for a given song.',
  usages: 'lyrics [song name]',
  cooldowns: 5,
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID } = event;
  const songName = args.join(" ").trim();

  if (!songName) {
    return api.sendMessage("Please provide a song name!", threadID, messageID);
  }

  try {
    await fetchLyrics(api, threadID, messageID, songName, 0);
  } catch (error) {
    console.error(`Error fetching lyrics for "${songName}":`, error);
    api.sendMessage(`Sorry, there was an error getting the lyrics for "${songName}"!`, threadID, messageID);
  }
};

const apiConfigs = [
  {
    name: "Primary API",
    url: (songName) => `https://lyrist.vercel.app/api/${encodeURIComponent(songName)}`,
  },
  {
    name: "Backup API 1",
    url: (songName) => `https://samirxpikachu.onrender.com/lyrics?query=${encodeURIComponent(songName)}`,
  },
  {
    name: "Backup API 2",
    url: (songName) => `https://markdevs-last-api.onrender.com/search/lyrics?q=${encodeURIComponent(songName)}`,
  },
  {
    name: "Backup API 3",
    url: (artist, song) => `https://openapi-idk8.onrender.com/lyrical/find?artist=${encodeURIComponent(artist)}&song=${encodeURIComponent(song)}`,
    requiresArtistAndSong: true,
  },
];

async function fetchLyrics(api, threadID, messageID, songName, attempt) {
  if (attempt >= apiConfigs.length) {
    api.sendMessage(`Sorry, lyrics for "${songName}" not found in all APIs!`, threadID, messageID);
    return;
  }

  const { name, url, requiresArtistAndSong } = apiConfigs[attempt];
  let apiUrl;

  try {
    if (requiresArtistAndSong) {
      const [artist, title] = songName.split('-').map(s => s.trim());
      if (!artist || !title) {
        throw new Error("Invalid format for artist and song title");
      }
      apiUrl = url(artist, title);
    } else {
      apiUrl = url(songName);
    }

    const response = await axios.get(apiUrl);
    const { lyrics, title, artist } = response.data;

    if (!lyrics) {
      throw new Error("Lyrics not found");
    }

    sendFormattedLyrics(api, threadID, messageID, title, artist, lyrics);
  } catch (error) {
    console.error(`Error fetching lyrics from ${name} for "${songName}":`, error.message || error);
    await fetchLyrics(api, threadID, messageID, songName, attempt + 1);
  }
}

function sendFormattedLyrics(api, threadID, messageID, title, artist, lyrics) {
  const formattedLyrics = `🎧 | Title: ${title}\n🎤 | Artist: ${artist}\n━━━━━━━━━━━━━━━━\n${lyrics}\n━━━━━━━━━━━━━━━━`;
  api.sendMessage(formattedLyrics, threadID, messageID);
      }
