---
layout: page
title: "Photo Gallery"
permalink: /gallery/
---
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

<div class="gallery">
  <img src="/gallery/SB/1.JPG" alt="Photo 1" width="300"/>
  <img src="/gallery/SB/2.JPG" alt="Photo 2" width="300"/>
  <img src="/gallery/SB/3.JPG" alt="Photo 3" width="300"/>
  <img src="/gallery/SB/4.JPG" alt="Photo 4" width="300"/>
</div>
