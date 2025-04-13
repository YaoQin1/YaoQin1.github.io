---
layout: page
title: "Photo Gallery"
permalink: /gallery/
---
<!-- Lightbox2 CSS -->
<link href="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.4/css/lightbox.min.css" rel="stylesheet" />

<!-- Lightbox2 JS -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.4/js/lightbox.min.js"></script>


<style>
.gallery-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  padding-top: 20px;
}

.gallery-container img {
  max-width: 100%;
  width: 300px;
  height: auto;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  transition: transform 0.2s ease-in-out;
}

.gallery-container img:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0,0,0,0.3);
}
</style>

<h2>Santa Barbara Beaches at Sunset!</h2>

<div class="gallery-container">
  <a href="/gallery/SB/1.JPG" data-lightbox="sb-gallery" data-title="Santa Barbara Sunset 1">
    <img src="/gallery/SB/1.JPG" alt="Photo 1">
  </a>
  <a href="/gallery/SB/2.JPG" data-lightbox="sb-gallery" data-title="Santa Barbara Sunset 2">
    <img src="/gallery/SB/2.JPG" alt="Photo 2">
  </a>
  <a href="/gallery/SB/3.JPG" data-lightbox="sb-gallery" data-title="Santa Barbara Sunset 3">
    <img src="/gallery/SB/3.JPG" alt="Photo 3">
  </a>
</div>
