<#
  generate-brand-assets.ps1 — rebuilds every RAEW brand asset from one master file.

  WHY THIS EXISTS
  ───────────────
  The brand master is a single 500x500 transparent PNG containing four stacked
  elements: the R/gear/leaf mark, the "RAEW" wordmark, the company name, and the
  tagline. Dropping that file straight into the header would render the mark at
  roughly 10px, because the header scales the whole lockup to 44px of height.
  Every surface needs a different cut of the same master, so each cut is
  generated here rather than hand-exported — re-exporting the logo then becomes
  one command instead of six manual crops that drift apart.

  MEASURED GEOMETRY (alpha bounding boxes of the master, 500x500)
  ──────────────────────────────────────────────────────────────
    mark                    x 131..365   y  78..279   (235 x 202)
    "RAEW" wordmark         x  49..457   y 300..369   (409 x  70)
    company name            x  48..451   y 386..399   (404 x  14)
    tagline + rules         x  48..451   y 415..422   (404 x   8)
    full lockup extent      x  48..457   y  78..422   (410 x 345)

  OUTPUTS
  ───────
    public/branding/raew-logo.png           full stacked lockup   (light grounds)
    public/branding/raew-logo-inverse.png   full stacked lockup   (dark grounds)
    public/branding/raew-mark.png           mark only             (light grounds)
    public/branding/raew-mark-inverse.png   mark only             (dark grounds)
    src/app/icon.png                        512x512 tile  -> <link rel="icon">
    src/app/apple-icon.png                  180x180 tile  -> apple-touch-icon
    src/app/favicon.ico                     48x48 PNG-in-ICO, stops the /favicon.ico 404

  COLOR SUBSTITUTION
  ──────────────────
  The master is flat two-tone, and its transparency is carried by the ALPHA
  channel while RGB stays at the flat ink value (measured: partial-alpha pixels
  average rgb(46,69,54), i.e. dark ink at partial coverage rather than colour
  blended toward the removed white background). That is what makes a pixel-level
  recolor safe: every pixel keeps its alpha and only its RGB is swapped, so
  antialiased edges stay antialiased with no light halo. Classification is by
  channel dominance — G more than 12 above both R and B is brand green,
  everything else is the neutral ink.

  RUN
  ───
    powershell -ExecutionPolicy Bypass -File scripts\generate-brand-assets.ps1
    powershell -ExecutionPolicy Bypass -File scripts\generate-brand-assets.ps1 -Source <master.png>
#>
[CmdletBinding()]
param(
  [string]$Source
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

# $PSScriptRoot is not reliably populated while parameter defaults are being
# evaluated (it came back empty under `powershell -File` on PS 5.1), so both
# roots are resolved here, in the body, with $MyInvocation as the fallback.
$scriptRoot = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }
$repoRoot   = Split-Path -Parent $scriptRoot
if (-not $Source) { $Source = Join-Path $scriptRoot 'brand\raew-logo-master.png' }

$brandingDir = Join-Path $repoRoot 'public\branding'
$appDir      = Join-Path $repoRoot 'src\app'

if (-not (Test-Path $Source)) { throw "Master artwork not found: $Source" }
if (-not (Test-Path $brandingDir)) { New-Item -ItemType Directory -Path $brandingDir | Out-Null }

# ── Brand values ────────────────────────────────────────────────────────────
# Sampled from the master by frequency, not eyeballed: the two dominant values
# are #095727/#0A5728 (the leaf and R) and #333333 (the gear and wordmark).
$BrandGreen   = [System.Drawing.Color]::FromArgb(255, 10, 87, 40)     # #0A5728
$BrandNeutral = [System.Drawing.Color]::FromArgb(255, 51, 51, 51)     # #333333

# Inverse (dark-ground) tiers. Same hues, re-pitched for legibility on
# --cinema-void: the neutral goes to near-white rather than pure white so the
# pair reads as a set, and the green lightens without losing the brand hue.
$InverseGreen   = [System.Drawing.Color]::FromArgb(255, 112, 219, 153) # #70DB99
$InverseNeutral = [System.Drawing.Color]::FromArgb(255, 248, 250, 252) # #F8FAFC

# Crop rectangles, derived from the bounding boxes above with padding added.
# The padding is not cosmetic: the mark's gear teeth reach the top-right corner
# of their box and a zero-padding crop clips their antialiased edge.
$LockupRect = @{ X = 22;  Y = 52; W = 462; H = 396 }  # full extent + 26px
$MarkRect   = @{ X = 111; Y = 58; W = 275; H = 242 }  # mark extent + 20px

function New-Crop {
  param(
    [System.Drawing.Bitmap]$SourceImage,
    [hashtable]$Rect
  )
  $bitmap = New-Object System.Drawing.Bitmap($Rect.W, $Rect.H, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  # Source rect copied verbatim — no scaling in this step, so a crop is a
  # pixel-exact copy and all resampling happens once, in the tile step below.
  $graphics.DrawImage(
    $SourceImage,
    (New-Object System.Drawing.Rectangle(0, 0, $Rect.W, $Rect.H)),
    (New-Object System.Drawing.Rectangle($Rect.X, $Rect.Y, $Rect.W, $Rect.H)),
    [System.Drawing.GraphicsUnit]::Pixel
  )
  $graphics.Dispose()
  return $bitmap
}

function Set-TwoToneRecolor {
  param(
    [System.Drawing.Bitmap]$Bitmap,
    [System.Drawing.Color]$Neutral,
    [System.Drawing.Color]$Green
  )
  for ($y = 0; $y -lt $Bitmap.Height; $y++) {
    for ($x = 0; $x -lt $Bitmap.Width; $x++) {
      $pixel = $Bitmap.GetPixel($x, $y)
      if ($pixel.A -eq 0) { continue }
      $isGreen = ($pixel.G -gt ($pixel.R + 12)) -and ($pixel.G -gt ($pixel.B + 12))
      $target = if ($isGreen) { $Green } else { $Neutral }
      $Bitmap.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($pixel.A, $target.R, $target.G, $target.B))
    }
  }
}

function New-AppTile {
  param(
    [System.Drawing.Bitmap]$Mark,
    [int]$Size,
    [int]$CornerRadius,
    [System.Drawing.Color]$Background,
    [string]$OutputPath
  )
  $tile = New-Object System.Drawing.Bitmap($Size, $Size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($tile)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

  # Rounded square, CLIPPED rather than drawn, so the corners come out genuinely
  # transparent instead of being painted over in a guessed background colour.
  # A radius of 0 means "full bleed, no clip" — AddArc rejects a zero-size arc,
  # which is what an unguarded path builder does to the apple-touch tile.
  # NOTE: the local is `$rounded`, not `$path` — a parameter named `$Path` of
  # type [string] would coerce this GraphicsPath assignment to a string.
  if ($CornerRadius -gt 0) {
    $rounded = New-Object System.Drawing.Drawing2D.GraphicsPath
    $d = $CornerRadius * 2
    $rounded.AddArc(0, 0, $d, $d, 180, 90)
    $rounded.AddArc($Size - $d, 0, $d, $d, 270, 90)
    $rounded.AddArc($Size - $d, $Size - $d, $d, $d, 0, 90)
    $rounded.AddArc(0, $Size - $d, $d, $d, 90, 90)
    $rounded.CloseFigure()

    $graphics.SetClip($rounded)
    $graphics.Clear($Background)
    $graphics.ResetClip()
    $rounded.Dispose()
  }
  else {
    $graphics.Clear($Background)
  }

  # Mark at 62% of the tile width: wide enough to carry the leaf detail at 16px,
  # inset enough that no gear tooth touches the rounded edge.
  $markWidth = [int]($Size * 0.62)
  $markHeight = [int]($markWidth * ($Mark.Height / $Mark.Width))
  $graphics.DrawImage($Mark, (New-Object System.Drawing.Rectangle(
    [int](($Size - $markWidth) / 2),
    [int](($Size - $markHeight) / 2),
    $markWidth,
    $markHeight
  )))
  $graphics.Dispose()

  $tile.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $tile.Dispose()
}

function New-FaviconIco {
  param(
    [System.Drawing.Bitmap]$Mark,
    [int]$Size,
    [string]$OutputPath
  )
  # A 48px tile with no rounding: at favicon size the corners are 1-2px and are
  # read as a soft square either way, while a full-bleed fill avoids a fringe
  # when a browser composites it onto a coloured tab strip.
  $square = New-Object System.Drawing.Bitmap($Size, $Size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($square)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $graphics.Clear($BrandGreen)
  $inner = [int]($Size * 0.72)
  $innerHeight = [int]($inner * ($Mark.Height / $Mark.Width))
  $graphics.DrawImage($Mark, (New-Object System.Drawing.Rectangle(
    [int](($Size - $inner) / 2),
    [int](($Size - $innerHeight) / 2),
    $inner,
    $innerHeight
  )))
  $graphics.Dispose()

  $stream = New-Object System.IO.MemoryStream
  $square.Save($stream, [System.Drawing.Imaging.ImageFormat]::Png)
  $png = $stream.ToArray()
  $stream.Dispose()
  $square.Dispose()

  # ICONDIR + one ICONDIRENTRY, then the PNG payload verbatim. PNG-in-ICO is
  # read by every browser released since Vista and keeps this file at ~1KB
  # instead of the 100KB+ an uncompressed 48px DIB would cost.
  $header = New-Object byte[] 22
  $header[2] = 1              # type: icon
  $header[4] = 1              # image count
  $header[6] = $Size          # width
  $header[7] = $Size          # height
  $header[10] = 1             # colour planes
  $header[12] = 32            # bits per pixel
  [BitConverter]::GetBytes([int]$png.Length).CopyTo($header, 14)
  [BitConverter]::GetBytes([int]22).CopyTo($header, 18)

  [System.IO.File]::WriteAllBytes($OutputPath, ($header + $png))
}

# ── Build ───────────────────────────────────────────────────────────────────
$master = [System.Drawing.Bitmap]::FromFile($Source)
if ($master.Width -ne 500 -or $master.Height -ne 500) {
  Write-Warning "Master is $($master.Width)x$($master.Height); the crop rectangles assume 500x500. Re-measure the bounding boxes before trusting the output."
}

$lockup = New-Crop $master $LockupRect
$lockup.Save((Join-Path $brandingDir 'raew-logo.png'), [System.Drawing.Imaging.ImageFormat]::Png)

$lockupInverse = New-Crop $master $LockupRect
Set-TwoToneRecolor $lockupInverse $InverseNeutral $InverseGreen
$lockupInverse.Save((Join-Path $brandingDir 'raew-logo-inverse.png'), [System.Drawing.Imaging.ImageFormat]::Png)

$mark = New-Crop $master $MarkRect
$mark.Save((Join-Path $brandingDir 'raew-mark.png'), [System.Drawing.Imaging.ImageFormat]::Png)

$markInverse = New-Crop $master $MarkRect
Set-TwoToneRecolor $markInverse $InverseNeutral $InverseGreen
$markInverse.Save((Join-Path $brandingDir 'raew-mark-inverse.png'), [System.Drawing.Imaging.ImageFormat]::Png)

New-AppTile $markInverse 512 96 $BrandGreen (Join-Path $appDir 'icon.png')
New-AppTile $markInverse 180 0 $BrandGreen (Join-Path $appDir 'apple-icon.png')
New-FaviconIco $markInverse 48 (Join-Path $appDir 'favicon.ico')

$master.Dispose()
$lockup.Dispose(); $lockupInverse.Dispose(); $mark.Dispose(); $markInverse.Dispose()

# ── Report ──────────────────────────────────────────────────────────────────
foreach ($file in @(
  (Join-Path $brandingDir 'raew-logo.png'),
  (Join-Path $brandingDir 'raew-logo-inverse.png'),
  (Join-Path $brandingDir 'raew-mark.png'),
  (Join-Path $brandingDir 'raew-mark-inverse.png'),
  (Join-Path $appDir 'icon.png'),
  (Join-Path $appDir 'apple-icon.png'),
  (Join-Path $appDir 'favicon.ico')
)) {
  $item = Get-Item $file
  Write-Output ("{0,-28} {1,8} bytes" -f $item.Name, $item.Length)
}
