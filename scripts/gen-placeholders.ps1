# Generate all placeholder SVGs for the portfolio project

# profile.svg
$profile = @'
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
  <rect width="300" height="300" fill="#1a1a1a"/>
  <circle cx="150" cy="110" r="55" fill="#333"/>
  <ellipse cx="150" cy="230" rx="80" ry="50" fill="#333"/>
  <text x="150" y="285" font-family="sans-serif" font-size="14" fill="#666" text-anchor="middle">PROFILE</text>
</svg>
'@
$profile | Set-Content "public\placeholders\profile.svg" -Encoding UTF8

# about.svg
$about = @'
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <rect width="800" height="800" fill="#1a1a1a"/>
  <text x="400" y="410" font-family="sans-serif" font-size="24" fill="#444" text-anchor="middle">ABOUT PHOTO</text>
</svg>
'@
$about | Set-Content "public\placeholders\about.svg" -Encoding UTF8

# og-image.svg
$og = @'
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#000"/>
  <text x="600" y="320" font-family="sans-serif" font-size="36" fill="#444" text-anchor="middle">OG IMAGE PLACEHOLDER</text>
</svg>
'@
$og | Set-Content "public\placeholders\og-image.svg" -Encoding UTF8

# Skill logos 1-5
for ($n = 1; $n -le 5; $n++) {
    $svg = "<svg xmlns='http://www.w3.org/2000/svg' width='128' height='128' viewBox='0 0 128 128'><rect width='128' height='128' rx='12' fill='#1e1e1e'/><text x='64' y='68' font-family='sans-serif' font-size='13' fill='#555' text-anchor='middle'>SKILL $n</text></svg>"
    $svg | Set-Content "public\placeholders\skill-$n.svg" -Encoding UTF8
}

# Gallery images for each category x 6
$categories = @("wildlife", "portraits", "fashion", "concerts")
foreach ($cat in $categories) {
    for ($n = 1; $n -le 6; $n++) {
        $svg = "<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'><rect width='600' height='600' fill='#1a1a1a'/><text x='300' y='295' font-family='sans-serif' font-size='20' fill='#444' text-anchor='middle'>$cat</text><text x='300' y='325' font-family='sans-serif' font-size='16' fill='#444' text-anchor='middle'>PLACEHOLDER $n</text></svg>"
        $svg | Set-Content "public\placeholders\$cat-$n.svg" -Encoding UTF8
    }
}

Write-Host "All placeholder SVGs created successfully."
