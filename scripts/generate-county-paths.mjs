/**
 * Generate SVG path data for Chicago-area counties.
 *
 * Counties:
 *   Cook (17031), DuPage (17043), Kane (17089),
 *   Lake IL (17097), McHenry (17111), Will (17197),
 *   Lake IN (18089)
 *
 * Also generates an approximate Lake Michigan shoreline path.
 *
 * Data source: US Census Bureau cartographic boundaries via plotly/datasets on GitHub.
 */

import https from "node:https";
import fs from "node:fs";
import path from "node:path";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const TARGET_FIPS = [
  "17031", // Cook
  "17043", // DuPage
  "17089", // Kane
  "17097", // Lake IL
  "17111", // McHenry
  "17197", // Will
  "18089", // Lake IN
];

const FIPS_NAMES = {
  "17031": "Cook County, IL",
  "17043": "DuPage County, IL",
  "17089": "Kane County, IL",
  "17097": "Lake County, IL",
  "17111": "McHenry County, IL",
  "17197": "Will County, IL",
  "18089": "Lake County, IN",
};

// SVG viewBox dimensions
const SVG_WIDTH = 850;
const SVG_HEIGHT = 900;
const PADDING = 30; // px padding inside the viewBox

// Path simplification tolerance (Douglas-Peucker). Increase for fewer points.
const SIMPLIFY_TOLERANCE = 0.006; // in degrees (~600 m)

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const get = (u) => {
      https
        .get(u, { headers: { "User-Agent": "node-script" } }, (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            get(res.headers.location);
            return;
          }
          if (res.statusCode !== 200) {
            reject(new Error(`HTTP ${res.statusCode} for ${u}`));
            return;
          }
          const chunks = [];
          res.on("data", (c) => chunks.push(c));
          res.on("end", () => {
            try {
              resolve(JSON.parse(Buffer.concat(chunks).toString()));
            } catch (e) {
              reject(e);
            }
          });
          res.on("error", reject);
        })
        .on("error", reject);
    };
    get(url);
  });
}

// Douglas-Peucker simplification
function perpendicularDistance(point, lineStart, lineEnd) {
  const dx = lineEnd[0] - lineStart[0];
  const dy = lineEnd[1] - lineStart[1];
  const mag = Math.sqrt(dx * dx + dy * dy);
  if (mag === 0) return Math.sqrt((point[0] - lineStart[0]) ** 2 + (point[1] - lineStart[1]) ** 2);
  const u = ((point[0] - lineStart[0]) * dx + (point[1] - lineStart[1]) * dy) / (mag * mag);
  const ix = lineStart[0] + u * dx;
  const iy = lineStart[1] + u * dy;
  return Math.sqrt((point[0] - ix) ** 2 + (point[1] - iy) ** 2);
}

function douglasPeucker(points, tolerance) {
  if (points.length <= 2) return points;
  let maxDist = 0;
  let maxIdx = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const d = perpendicularDistance(points[i], points[0], points[points.length - 1]);
    if (d > maxDist) {
      maxDist = d;
      maxIdx = i;
    }
  }
  if (maxDist > tolerance) {
    const left = douglasPeucker(points.slice(0, maxIdx + 1), tolerance);
    const right = douglasPeucker(points.slice(maxIdx), tolerance);
    return left.slice(0, -1).concat(right);
  }
  return [points[0], points[points.length - 1]];
}

// Project longitude/latitude to flat X/Y using equirectangular projection.
// We compute cosine correction at the center latitude for better aspect ratio.
function projectCoords(coords, centerLat) {
  const cosLat = Math.cos((centerLat * Math.PI) / 180);
  return coords.map(([lng, lat]) => [lng * cosLat, lat]);
}

// Convert projected coordinates to SVG path d attribute.
function coordsToSVGPath(rings, transform) {
  const parts = [];
  for (const ring of rings) {
    const projected = ring.map(([x, y]) => {
      const sx = (x - transform.minX) * transform.scale + PADDING;
      const sy = (transform.maxY - y) * transform.scale + PADDING; // flip Y
      return [Math.round(sx * 10) / 10, Math.round(sy * 10) / 10];
    });
    parts.push("M" + projected.map((p) => p.join(",")).join("L") + "Z");
  }
  return parts.join(" ");
}

// ---------------------------------------------------------------------------
// Lake Michigan shoreline extraction
// ---------------------------------------------------------------------------

/**
 * Walk a ring (ordered boundary) and extract the contiguous segment where
 * points are east of the given threshold. Returns the segment ordered from
 * high latitude (north) to low latitude (south).
 */
function extractEasternSegment(ring, xThreshold) {
  // Find the longest contiguous run of points east of xThreshold
  const runs = [];
  let currentRun = [];

  for (let i = 0; i < ring.length; i++) {
    if (ring[i][0] >= xThreshold) {
      currentRun.push(ring[i]);
    } else {
      if (currentRun.length > 0) {
        runs.push(currentRun);
        currentRun = [];
      }
    }
  }
  if (currentRun.length > 0) runs.push(currentRun);

  // Handle wrap-around: if first and last runs are both east, merge them
  if (runs.length >= 2) {
    const first = runs[0];
    const last = runs[runs.length - 1];
    const firstPt = first[0];
    const lastPt = last[last.length - 1];
    // Check if the ring wraps (first point ~= last point)
    const ringFirst = ring[0];
    const ringLast = ring[ring.length - 1];
    const dist = Math.sqrt((ringFirst[0] - ringLast[0]) ** 2 + (ringFirst[1] - ringLast[1]) ** 2);
    if (dist < 0.001) {
      // Ring is closed, merge last run + first run
      const merged = [...last, ...first];
      runs[0] = merged;
      runs.pop();
    }
  }

  // Pick the longest run
  let best = [];
  for (const run of runs) {
    if (run.length > best.length) best = run;
  }

  // Sort north to south (high lat = high y in projected coords)
  best.sort((a, b) => b[1] - a[1]);
  return best;
}

/**
 * Extract the northern boundary segment of a ring (for Lake IN).
 */
function extractNorthernSegment(ring, yThreshold) {
  const runs = [];
  let currentRun = [];

  for (let i = 0; i < ring.length; i++) {
    if (ring[i][1] >= yThreshold) {
      currentRun.push(ring[i]);
    } else {
      if (currentRun.length > 0) {
        runs.push(currentRun);
        currentRun = [];
      }
    }
  }
  if (currentRun.length > 0) runs.push(currentRun);

  // Handle wrap-around
  if (runs.length >= 2) {
    const ringFirst = ring[0];
    const ringLast = ring[ring.length - 1];
    const dist = Math.sqrt((ringFirst[0] - ringLast[0]) ** 2 + (ringFirst[1] - ringLast[1]) ** 2);
    if (dist < 0.001) {
      const merged = [...runs[runs.length - 1], ...runs[0]];
      runs[0] = merged;
      runs.pop();
    }
  }

  let best = [];
  for (const run of runs) {
    if (run.length > best.length) best = run;
  }

  // Sort west to east for the northern boundary
  best.sort((a, b) => a[0] - b[0]);
  return best;
}

/**
 * Build a clean Lake Michigan shoreline from the SIMPLIFIED county paths.
 *
 * Since the simplified county paths already define the boundaries precisely,
 * we extract the lakefront vertices from each county's simplified ring by
 * walking the ring in order and collecting the eastern/northern segments
 * that face the lake. This avoids sorting artifacts.
 */
function extractLakeShoreline(projectedRings, simplifiedRings, transform) {
  // For each lakefront county, walk the simplified ring in order and extract
  // the contiguous segment that borders the lake.

  const shoreSegments = [];

  // --- Lake County IL (17097) ---
  // Lake shore is the eastern edge. From the simplified path:
  //   M384.3,30.4 L501.3,32.6 L499,100.1 L491.8,114.7 L485.2,152.5
  //   L495.8,196.4 L520.6,246.4 L314,245.2 L314.1,30 L384.3,30.4
  // The lake segment runs from (501.3,32.6) south to (520.6,246.4)
  {
    const ring = simplifiedRings["17097"]?.[0];
    if (ring) {
      const xs = ring.map((p) => p[0]);
      const xMid = (Math.min(...xs) + Math.max(...xs)) / 2;
      // Walk ring, find contiguous east segment
      const segment = findContiguousSegment(ring, (p) => p[0] > xMid);
      if (segment.length > 0) {
        // Ensure ordered north to south (high Y to low Y in projected coords)
        if (segment[0][1] < segment[segment.length - 1][1]) segment.reverse();
        shoreSegments.push(segment);
      }
    }
  }

  // --- Cook County IL (17031) ---
  // Lake shore is the eastern edge from ~(520.6,246.4) south to ~(631.1,526.1).
  // From the simplified path, the eastern segment goes:
  //   520.6,246.4 -> 561.9,305.6 -> 563,324 -> 584.1,402.7 -> 589.9,410.3
  //   -> 591,439.9 -> 613.9,489.7 -> 627.9,500.9 -> 631.1,526.1
  // These are the points after the NW corner and before the SE corner.
  {
    const ring = simplifiedRings["17031"]?.[0];
    if (ring) {
      const xs = ring.map((p) => p[0]);
      const xMid = (Math.min(...xs) + Math.max(...xs)) / 2;
      // For Cook, additionally filter: only points north of lat ~41.63
      // to avoid the southern horizontal leg
      const segment = findContiguousSegment(ring, (p) => p[0] > xMid && p[1] > 41.63);
      if (segment.length > 0) {
        if (segment[0][1] < segment[segment.length - 1][1]) segment.reverse();
        shoreSegments.push(segment);
      }
    }
  }

  // --- Lake County IN (18089) ---
  // Lake shore is the northern edge. From the simplified path:
  //   629.8,784.4 L632.7,525.1 L639.8,536.7 L656.1,548.4 L671.2,549.8
  //   L674.1,556.2 L671,560.1 L678.3,567.3 L724.8,579.8 L772.5,579.1
  //   L774.3,819.8 L682.5,870 L629.9,867.6
  // Northern segment: 632.7,525.1 through 772.5,579.1
  {
    const ring = simplifiedRings["18089"]?.[0];
    if (ring) {
      const ys = ring.map((p) => p[1]);
      const yMid = (Math.min(...ys) + Math.max(...ys)) / 2;
      const segment = findContiguousSegment(ring, (p) => p[1] > yMid);
      if (segment.length > 0) {
        // Order west to east
        if (segment[0][0] > segment[segment.length - 1][0]) segment.reverse();
        shoreSegments.push(segment);
      }
    }
  }

  // Concatenate segments, removing duplicate junction points
  let allPoints = [];
  for (const seg of shoreSegments) {
    for (const pt of seg) {
      // Skip if this point is (nearly) identical to the last added point
      if (allPoints.length > 0) {
        const prev = allPoints[allPoints.length - 1];
        const d = Math.sqrt((pt[0] - prev[0]) ** 2 + (pt[1] - prev[1]) ** 2);
        if (d < 0.001) continue;
      }
      allPoints.push(pt);
    }
  }

  if (allPoints.length === 0) return null;

  console.log(`  Shoreline: ${allPoints.length} points from simplified county boundaries`);

  // Convert to SVG coordinates
  const svgPoints = allPoints.map(([x, y]) => {
    const sx = (x - transform.minX) * transform.scale + PADDING;
    const sy = (transform.maxY - y) * transform.scale + PADDING;
    return [Math.round(sx * 10) / 10, Math.round(sy * 10) / 10];
  });

  // Close the shape: shoreline from NW (top of Lake IL) to SE (east end of Lake IN),
  // then east to SVG boundary and back north.
  const rightEdge = SVG_WIDTH + 10;
  const firstPt = svgPoints[0];
  const lastPt = svgPoints[svgPoints.length - 1];

  const pathParts = [
    "M" + svgPoints.map((p) => p.join(",")).join("L"),
    `L${rightEdge},${lastPt[1]}`,
    `L${rightEdge},${firstPt[1]}`,
    "Z",
  ];

  return pathParts.join(" ");
}

/**
 * Walk a ring (closed polygon) and find the longest contiguous segment
 * where all points match the predicate. Handles wrap-around.
 */
function findContiguousSegment(ring, predicate) {
  // Build runs of consecutive matching points
  const n = ring.length;
  const runs = [];
  let current = [];

  for (let i = 0; i < n; i++) {
    if (predicate(ring[i])) {
      current.push(ring[i]);
    } else {
      if (current.length > 0) {
        runs.push(current);
        current = [];
      }
    }
  }
  if (current.length > 0) runs.push(current);

  // Handle wrap-around: if first and last runs both match, merge them
  if (runs.length >= 2) {
    const firstPt = ring[0];
    const lastPt = ring[n - 1];
    if (predicate(firstPt) && predicate(lastPt)) {
      const merged = [...runs[runs.length - 1], ...runs[0]];
      runs[0] = merged;
      runs.pop();
    }
  }

  // Return the longest run
  let best = [];
  for (const run of runs) {
    if (run.length > best.length) best = run;
  }
  return best;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("Fetching county GeoJSON from plotly/datasets...");
  console.log("(This file is ~25 MB, may take a moment)\n");

  const url =
    "https://raw.githubusercontent.com/plotly/datasets/master/geojson-counties-fips.json";

  const geojson = await fetchJSON(url);
  console.log(`Loaded ${geojson.features.length} county features.\n`);

  // Extract target counties
  const counties = {};
  for (const feature of geojson.features) {
    const fips = feature.id || feature.properties?.GEO_ID?.slice(-5) || feature.properties?.FIPS;
    if (fips && TARGET_FIPS.includes(fips)) {
      counties[fips] = feature;
    }
  }

  const found = Object.keys(counties);
  console.log(`Found ${found.length}/${TARGET_FIPS.length} target counties: ${found.join(", ")}`);
  for (const fips of TARGET_FIPS) {
    if (!counties[fips]) console.warn(`  WARNING: Missing FIPS ${fips} (${FIPS_NAMES[fips]})`);
  }

  // Collect all coordinates to determine bounds
  let allCoords = [];
  const rawRings = {}; // fips -> [[ring1], [ring2], ...]

  for (const [fips, feature] of Object.entries(counties)) {
    const geom = feature.geometry;
    const polygons =
      geom.type === "MultiPolygon"
        ? geom.coordinates
        : geom.type === "Polygon"
        ? [geom.coordinates]
        : [];

    rawRings[fips] = [];
    for (const polygon of polygons) {
      for (const ring of polygon) {
        rawRings[fips].push(ring);
        allCoords = allCoords.concat(ring);
      }
    }
  }

  // Compute center latitude for projection
  const lats = allCoords.map((c) => c[1]);
  const lngs = allCoords.map((c) => c[0]);
  const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
  const cosLat = Math.cos((centerLat * Math.PI) / 180);

  console.log(`\nCenter latitude: ${centerLat.toFixed(4)}`);
  console.log(`Cos correction: ${cosLat.toFixed(4)}`);
  console.log(`Lon range: ${Math.min(...lngs).toFixed(4)} to ${Math.max(...lngs).toFixed(4)}`);
  console.log(`Lat range: ${Math.min(...lats).toFixed(4)} to ${Math.max(...lats).toFixed(4)}`);

  // Project and simplify each county
  const projectedRings = {};
  const simplifiedRings = {};

  for (const [fips, rings] of Object.entries(rawRings)) {
    projectedRings[fips] = rings.map((ring) => projectCoords(ring, centerLat));
    simplifiedRings[fips] = projectedRings[fips].map((ring) =>
      douglasPeucker(ring, SIMPLIFY_TOLERANCE * cosLat)
    );
  }

  // Compute projected bounds across all simplified rings
  let allProjected = [];
  for (const rings of Object.values(simplifiedRings)) {
    for (const ring of rings) {
      allProjected = allProjected.concat(ring);
    }
  }

  const projMinX = Math.min(...allProjected.map((p) => p[0]));
  const projMaxX = Math.max(...allProjected.map((p) => p[0]));
  const projMinY = Math.min(...allProjected.map((p) => p[1]));
  const projMaxY = Math.max(...allProjected.map((p) => p[1]));

  const projWidth = projMaxX - projMinX;
  const projHeight = projMaxY - projMinY;
  const usableWidth = SVG_WIDTH - 2 * PADDING;
  const usableHeight = SVG_HEIGHT - 2 * PADDING;

  const scale = Math.min(usableWidth / projWidth, usableHeight / projHeight);

  // Center the map in the viewBox
  const scaledWidth = projWidth * scale;
  const scaledHeight = projHeight * scale;
  const offsetX = (usableWidth - scaledWidth) / 2;
  const offsetY = (usableHeight - scaledHeight) / 2;

  const transform = {
    minX: projMinX - offsetX / scale,
    maxY: projMaxY + offsetY / scale,
    scale,
    cosLat,
  };

  console.log(`\nProjected bounds: X[${projMinX.toFixed(4)}, ${projMaxX.toFixed(4)}], Y[${projMinY.toFixed(4)}, ${projMaxY.toFixed(4)}]`);
  console.log(`Scale factor: ${scale.toFixed(2)}`);

  // Generate SVG paths
  console.log("\n" + "=".repeat(70));
  console.log("SVG PATH DATA (viewBox=\"0 0 850 900\")");
  console.log("=".repeat(70));

  const results = {};

  for (const fips of TARGET_FIPS) {
    if (!simplifiedRings[fips]) continue;
    const d = coordsToSVGPath(simplifiedRings[fips], transform);
    const pointCount = simplifiedRings[fips].reduce((sum, r) => sum + r.length, 0);
    results[fips] = { name: FIPS_NAMES[fips], d, pointCount };

    console.log(`\n--- ${FIPS_NAMES[fips]} (FIPS: ${fips}) [${pointCount} points] ---`);
    console.log(d);
  }

  // Lake Michigan shoreline
  console.log("\n--- Lake Michigan Shoreline ---");
  const lakeD = extractLakeShoreline(projectedRings, simplifiedRings, transform);
  if (lakeD) {
    console.log(lakeD);
    results["lake"] = { name: "Lake Michigan", d: lakeD };
  } else {
    console.log("(Could not extract shoreline)");
  }

  // Write a preview SVG file
  const svgLines = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SVG_WIDTH} ${SVG_HEIGHT}" width="${SVG_WIDTH}" height="${SVG_HEIGHT}">`,
    `  <rect width="${SVG_WIDTH}" height="${SVG_HEIGHT}" fill="#0b162a" />`,
  ];

  if (results["lake"]) {
    svgLines.push(`  <path d="${results["lake"].d}" fill="#1a3a5c" stroke="none" />`);
  }

  const countyColors = {
    "17031": "#ef5917", // Cook - orange (primary)
    "17043": "#1e3a5f",
    "17089": "#1e3a5f",
    "17097": "#1e3a5f",
    "17111": "#1e3a5f",
    "17197": "#1e3a5f",
    "18089": "#2a4a3f", // Lake IN - slightly different to show state line
  };

  for (const fips of TARGET_FIPS) {
    if (!results[fips]) continue;
    const fill = countyColors[fips] || "#1e3a5f";
    svgLines.push(
      `  <path d="${results[fips].d}" fill="${fill}" stroke="#ffffff" stroke-width="1.5" />`,
    );
  }

  // Add labels
  const labelPositions = {};
  for (const fips of TARGET_FIPS) {
    if (!simplifiedRings[fips]) continue;
    // Compute centroid
    let cx = 0, cy = 0, n = 0;
    for (const ring of simplifiedRings[fips]) {
      for (const pt of ring) {
        cx += pt[0];
        cy += pt[1];
        n++;
      }
    }
    cx /= n;
    cy /= n;
    const sx = (cx - transform.minX) * transform.scale + PADDING;
    const sy = (transform.maxY - cy) * transform.scale + PADDING;
    labelPositions[fips] = [Math.round(sx), Math.round(sy)];
  }

  for (const fips of TARGET_FIPS) {
    if (!labelPositions[fips]) continue;
    const [lx, ly] = labelPositions[fips];
    const shortName = FIPS_NAMES[fips].replace(/ County.*/, "");
    svgLines.push(
      `  <text x="${lx}" y="${ly}" text-anchor="middle" fill="white" font-size="18" font-family="sans-serif">${shortName}</text>`,
    );
  }

  svgLines.push(`</svg>`);

  const svgPath = path.join(
    path.dirname(new URL(import.meta.url).pathname),
    "..",
    "public",
    "maps",
    "chicago-metro-counties.svg",
  );

  fs.mkdirSync(path.dirname(svgPath), { recursive: true });
  fs.writeFileSync(svgPath, svgLines.join("\n"));
  console.log(`\nPreview SVG saved to: ${svgPath}`);

  // Also write a JSON file with the path data for easy import
  const jsonPath = path.join(
    path.dirname(new URL(import.meta.url).pathname),
    "..",
    "src",
    "data",
    "county-paths.json",
  );
  fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
  fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));
  console.log(`JSON data saved to: ${jsonPath}`);

  // Print a summary
  console.log("\n" + "=".repeat(70));
  console.log("SUMMARY");
  console.log("=".repeat(70));
  for (const fips of TARGET_FIPS) {
    if (!results[fips]) continue;
    console.log(
      `  ${FIPS_NAMES[fips].padEnd(25)} ${results[fips].pointCount.toString().padStart(3)} points  d.length=${results[fips].d.length}`,
    );
  }
  if (results["lake"]) {
    console.log(`  ${"Lake Michigan".padEnd(25)}            d.length=${results["lake"].d.length}`);
  }
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
