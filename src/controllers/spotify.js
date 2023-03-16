
import axios from 'axios';
import qs from 'qs';

async function getSpotifyAuthorization() {
  try {
    const auth_token = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`, 'utf-8').toString('base64');
    const token_url = 'https://accounts.spotify.com/api/token';
    const data = qs.stringify({'grant_type':'client_credentials'});

    const res = await axios.post(token_url, data, {
      headers: {
        'Authorization': `Basic ${auth_token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    return res.data.access_token;
  } catch(error) {
    console.error(error);
  }
}

/**
 * 
 * @param {string} query 
 * @returns {Array} array of matching songs
 */
export async function searchSpotify(query) {
  let accessToken = await getSpotifyAuthorization();

  //const search_url = `https://api.spotify.com/v1/search?q=${query}&type=track,album,artist&limit=10`;
  const search_url = `https://api.spotify.com/v1/search?q=${query}&type=track&limit=10`;

  try { 
    const res = await axios.get(search_url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    return res.data;
  } catch(error) {
    console.error(error);
  }
}