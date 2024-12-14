
// Your Spotify client ID, obtained from the Spotify Developer Dashboard


// The URL where Spotify will redirect after login

export const clientId = 'client ID needed';
export const redirectUri = 'http://127.0.0.1:5500/index.html';
// The required permissions (scopes) for accessing user data
const scope = "user-read-private user-read-email";

// Add an event listener to the login button
document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.getElementById("login");

    // Ensure the login button exists
    if (loginButton) {
        loginButton.addEventListener("click", () => {
            // Generate the URL parameters for Spotify authorization
            const params = new URLSearchParams({
                client_id: clientId,       // Your app's Client ID
                response_type: "token",   // Use token-based implicit grant flow
                redirect_uri: redirectUri, // Where Spotify redirects after login
                scope: scope,             // Permissions requested from the user
            });

            // Redirect the user to Spotify's authorization page
            window.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
        });
    }
});

// Extract the access token from the URL fragment after Spotify redirects back
function getAccessTokenFromUrl() {
    const hash = window.location.hash.substring(1); // Get the part after the `#`
    const params = new URLSearchParams(hash);       // Parse the URL fragment
    return params.get("access_token");              // Retrieve the access token
}

// Fetch the user's profile data from the Spotify Web API
async function fetchProfile(token) {
    try {
        // Make a GET request to the Spotify API with the access token
        const response = await fetch("https://api.spotify.com/v1/me", {
            headers: {
                Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
        });

        // Parse and return the response JSON
        return response.json();
    } catch (error) {
        console.error("Failed to fetch profile:", error);
    }
}

// Populate the profile section with the user's Spotify data
function populateUI(profile) {
    // Make the profile section visible
    const profileSection = document.getElementById("profile");
    if (profileSection) {
        profileSection.style.display = "block"; // Show the hidden profile section
    }

    // Update the UI with the user's profile information
    document.getElementById("displayName").innerText = profile.display_name;

    // Display the user's profile image, if available
    if (profile.images && profile.images.length > 0) {
        const img = new Image();
        img.src = profile.images[0].url; // URL of the profile image
        img.alt = "Profile Avatar";
        img.width = 100; // Set the image width
        document.getElementById("avatar").appendChild(img); // Add the image to the avatar div
    }

    // Update other profile details
    document.getElementById("id").innerText = profile.id;
    document.getElementById("email").innerText = profile.email;
    document.getElementById("uri").innerText = profile.uri;
    document.getElementById("uri").href = profile.external_urls.spotify;
    document.getElementById("imgUrl").innerText = profile.images[0]?.url || "(No profile image)";
}

// Main logic: Run when the page is loaded
(async function main() {
    // Get the access token from the URL
    const token = getAccessTokenFromUrl();

    // If no token exists, return (the user needs to log in)
    if (!token) return;

    // Fetch the user's Spotify profile using the token
    const profile = await fetchProfile(token);

    // Populate the UI with the fetched profile data
    if (profile) {
        populateUI(profile);
    }
})();
