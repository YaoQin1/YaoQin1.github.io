document.addEventListener('DOMContentLoaded', function() {
    // Initialize the map with strict bounds
    const map = L.map('map', {
        center: [20, 0],
        zoom: 2,
        minZoom: 2,
        maxZoom: 18,
        maxBoundsViscosity: 1.0,
        worldCopyJump: false,
        maxBounds: [
            [-90, -180],  // Southwest coordinates
            [90, 180]     // Northeast coordinates
        ],
        scrollWheelZoom: true,
        dragging: true
    });

    // Custom tile layer with clamped coordinates
    const customTileLayer = L.TileLayer.extend({
        getTileUrl: function(coords) {
            // Clamp x coordinates to prevent wrapping
            const x = ((coords.x % this.options.tileSize) + this.options.tileSize) % this.options.tileSize;
            const y = coords.y;
            const z = coords.z;
            
            // Only return tiles within the world bounds
            if (x < 0 || x >= Math.pow(2, z) || y < 0 || y >= Math.pow(2, z)) {
                return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=';  // Transparent pixel
            }
            
            return `https://${this.options.subdomains[Math.abs(x + y) % this.options.subdomains.length]}.tile.openstreetmap.org/${z}/${x}/${y}.png`;
        }
    });

    // Add the custom tile layer
    new customTileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        subdomains: 'abc',
        tileSize: 256,
        noWrap: true,
        bounds: [[-90, -180], [90, 180]],
        minZoom: 2,
        maxZoom: 18
    }).addTo(map);

    // Add white background
    L.rectangle([[-90, -180], [90, 180]], {
        fill: true,
        color: 'white',
        fillOpacity: 1,
        stroke: false,
        interactive: false
    }).addTo(map);

    // Add a clipping mask for the world bounds
    const clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
    clipPath.setAttribute('id', 'world-bounds');
    const clipRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    clipRect.setAttribute('x', '-180');
    clipRect.setAttribute('y', '-90');
    clipRect.setAttribute('width', '360');
    clipRect.setAttribute('height', '180');
    clipPath.appendChild(clipRect);

    // Add the clip path to the map's SVG
    const mapPane = map.getPanes().mapPane;
    const svg = mapPane.querySelector('svg');
    if (svg) {
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        defs.appendChild(clipPath);
        svg.appendChild(defs);
        mapPane.querySelector('.leaflet-tile-pane').style.clipPath = 'url(#world-bounds)';
    }

    // Enforce bounds on map movement
    map.on('moveend', function() {
        const center = map.getCenter();
        const lng = center.lng;
        
        // Keep longitude within -180 to 180 range
        if (lng < -180 || lng > 180) {
            const newLng = ((lng + 180) % 360) - 180;
            map.setView([center.lat, newLng], map.getZoom(), { animate: false });
        }
    });

    // Define locations with their coordinates and their countries
    const locations = [
        { name: "Amsterdam", coords: [52.3676, 4.9041], link: "#amsterdam", country: "Netherlands" },
        { name: "Budapest", coords: [47.4979, 19.0402], link: "#budapest", country: "Hungary" },
        { name: "Austria Lake District", coords: [47.8095, 13.0550], link: "#lake", country: "Austria" },
        { name: "Japan", coords: [35.0116, 135.7681], link: "#kyoto", country: "Japan" },
        { name: "Chinese Yunnan", coords: [25.0389, 102.7183], link: "#yunnan", country: "China" },
        { name: "Madagascar", coords: [-18.7669, 46.8691], link: "#madagascar", country: "Madagascar" },
        { name: "Santa Barbara", coords: [34.4208, -119.6982], link: "#santa-barbara", country: "United States" }
    ];

    // Custom icon for markers
    const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="
            width: 10px;
            height: 10px;
            background-color: #BD5D38;
            border: 2px solid white;
            border-radius: 50%;
            box-shadow: 0 0 4px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [10, 10],
        iconAnchor: [5, 5]
    });

    // Variable to store the currently highlighted country layer
    let highlightedCountry = null;

    // Function to highlight a country
    async function highlightCountry(countryName) {
        try {
            // Remove previous highlight if exists
            if (highlightedCountry) {
                map.removeLayer(highlightedCountry);
                highlightedCountry = null;
            }

            // Use a different API endpoint that provides country boundaries
            const response = await fetch(`https://nominatim.openstreetmap.org/search?country=${encodeURIComponent(countryName)}&polygon_geojson=1&format=json`);
            const data = await response.json();

            if (data && data[0] && data[0].geojson) {
                highlightedCountry = L.geoJSON(data[0].geojson, {
                    className: 'country-highlight',
                    style: {
                        fillColor: '#BD5D38',
                        fillOpacity: 0.2,
                        color: '#BD5D38',
                        weight: 2,
                        opacity: 0.6
                    }
                }).addTo(map);
            }
        } catch (error) {
            console.error('Error highlighting country:', error);
        }
    }

    // Function to remove highlight
    function removeHighlight() {
        if (highlightedCountry) {
            map.removeLayer(highlightedCountry);
            highlightedCountry = null;
        }
    }

    // Add markers for each location
    locations.forEach(location => {
        const marker = L.marker(location.coords, { icon: customIcon })
            .addTo(map)
            .bindPopup(`<a href="gallery/index.html${location.link}" style="
                color: #2c3e50;
                text-decoration: none;
                font-weight: 500;
                padding: 4px 8px;
                display: block;
                border-radius: 4px;
            ">${location.name}</a>`);
        
        marker.on('mouseover', function() {
            this.openPopup();
            highlightCountry(location.country);
        });

        marker.on('mouseout', function() {
            this.closePopup();
            removeHighlight();
        });
    });

    // Add CSS to ensure map container has a white background
    const mapContainer = document.getElementById('map');
    mapContainer.style.backgroundColor = 'white';

    // Adjust map view on window resize
    window.addEventListener('resize', function() {
        map.invalidateSize();
    });
}); 