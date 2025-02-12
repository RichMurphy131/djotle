import 'bootstrap/dist/css/bootstrap.css';
import { useState } from "react";
import axios from "axios";
import { getSecrets } from "./secrets.js";

const DISC_API_URL = "https://api.discogs.com/database/search";

/*
    Retrieving 4 secrets from AWS Secret Manager
 */
(async () => {
    try {
        const secretNames = ["DISC_API_KEY", "DISC_API_SECRET", "SPOT_API_KEY", "SPOT_API_SECRET"];
        const secrets = await getSecrets(secretNames);

        // Storing each secret in its respective variable
        const DISC_API_KEY = secrets["DISC_API_KEY"];
        const DISC_API_SECRET = secrets["DISC_API_SECRET"];
        const SPOT_API_KEY = secrets["SPOT_API_KEY"];
        const SPOT_API_SECRET = secrets["SPOT_API_SECRET"];

    } catch (error) {
        console.error("Failed to retrieve secrets:", error);
    }
})();


export default function DiscogsSearch() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);


    /*
        Async function that searches Discogs API for a query string and returns a set of Albums

     */
    const searchAlbums = async () => {
        if (!query) return;
        setLoading(true);
        try {
            const response = await axios.get(DISC_API_URL, {
                params: {
                    q: query,
                    type: "release",
                    key: DISC_API_KEY,
                    secret: DISC_API_SECRET,
                },
            });
            setResults(response.data.results);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        setLoading(false);
    };

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Discogs Album Search</h1>
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    placeholder="Search for an album..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="border p-2 flex-1 rounded"
                />
                <button
                    onClick={searchAlbums}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Search
                </button>
            </div>
            {loading && <p>Loading...</p>}
            <div className="grid grid-cols-2 gap-4">
                {results.map((album) => (
                    <div key={album.id} className="border p-2 rounded shadow">
                        <img src={album.cover_image} alt={album.title} className="w-full h-40 object-cover mb-2" />
                        <h2 className="text-lg font-semibold">{album.title}</h2>
                        <p className="text-sm text-gray-600">{album.year}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
